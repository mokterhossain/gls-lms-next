import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyAccessToken } from "./lib/auth";

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const accessToken =
    req.cookies.get("accessToken")?.value ||
    req.headers.get("authorization")?.replace("Bearer ", "");

  const refreshToken = req.cookies.get("refreshToken")?.value;

  const isLoginPage = pathname === "/login";
  const isApi = pathname.startsWith("/api");
  const isAuthApi = pathname.startsWith("/api/auth");

  const isPublicAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.startsWith("/images");

  /* =========================
     SKIP STATIC
  ========================= */
  if (isPublicAsset) return NextResponse.next();

  /* =========================
     ALLOW AUTH APIs
  ========================= */
  if (isAuthApi) return NextResponse.next();

  /* =========================
     NO ACCESS TOKEN
  ========================= */
  if (!accessToken) {
    if (isApi) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    if (isLoginPage) return NextResponse.next();

    return NextResponse.redirect(new URL("/login", req.url));
  }

  /* =========================
     VERIFY ACCESS TOKEN
  ========================= */
  try {
    const user: any = verifyAccessToken(accessToken);

    const ip =
      req.headers.get("x-forwarded-for") ||
      req.headers.get("x-real-ip") ||
      "";

    const headers = new Headers(req.headers);
    headers.set("x-user-id", user.userId);
    headers.set("x-ip", ip);

    if (isLoginPage) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next({
      request: { headers },
    });

  } catch (err: any) {
    const isExpired = err?.name === "TokenExpiredError";

    /* =========================
       🔥 TOKEN EXPIRED → REFRESH
    ========================= */
    if (isExpired && refreshToken) {
      try {
        const refreshRes = await fetch(
          `${req.nextUrl.origin}/api/auth/refresh`,
          {
            method: "POST",
            headers: {
              cookie: `refreshToken=${refreshToken}`,
            },
          }
        );

        if (!refreshRes.ok) throw new Error("Refresh failed");

        const newAccessToken =
          refreshRes.headers.get("set-cookie")?.match(/accessToken=([^;]+)/)?.[1];

        if (!newAccessToken) throw new Error("No new token");

        const user: any = verifyAccessToken(newAccessToken);

        const headers = new Headers(req.headers);
        headers.set("x-user-id", user.userId);

        const res = NextResponse.next({
          request: { headers },
        });

        // ✅ SET NEW ACCESS TOKEN
        res.cookies.set("accessToken", newAccessToken, {
          httpOnly: true,
          secure: true,
          path: "/",
        });

        return res;

      } catch {
        // refresh failed → logout
        const res = isApi
          ? NextResponse.json({ message: "Session expired" }, { status: 401 })
          : NextResponse.redirect(new URL("/login", req.url));

        res.cookies.set("accessToken", "", { path: "/", expires: new Date(0) });
        res.cookies.set("refreshToken", "", { path: "/", expires: new Date(0) });

        return res;
      }
    }

    /* =========================
       INVALID TOKEN
    ========================= */
    const res = isApi
      ? NextResponse.json({ message: "Invalid token" }, { status: 401 })
      : NextResponse.redirect(new URL("/login", req.url));

    res.cookies.set("accessToken", "", { path: "/", expires: new Date(0) });
    res.cookies.set("refreshToken", "", { path: "/", expires: new Date(0) });

    return res;
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};