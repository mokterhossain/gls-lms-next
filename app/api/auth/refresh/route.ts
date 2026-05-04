import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import {
  verifyRefreshToken,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!refreshToken) {
    return NextResponse.json({ error: "No token" }, { status: 401 });
  }

  try {
    const payload: any = verifyRefreshToken(refreshToken);

    const session = await prisma.session.findFirst({
      where: {
        refreshToken,
        revoked: false,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 });
    }

    if (session.expiresAt < new Date()) {
      await prisma.session.update({
        where: { id: session.id },
        data: { revoked: true },
      });

      return NextResponse.json({ error: "Session expired" }, { status: 401 });
    }

    // 🔥 rotate
    const newRefreshToken = generateRefreshToken(payload);
    const newAccessToken = generateAccessToken(payload);

    await prisma.session.update({
      where: { id: session.id },
      data: { revoked: true },
    });

    await prisma.session.create({
      data: {
        userId: payload.userId,
        refreshToken: newRefreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });

    const res = NextResponse.json({ success: true });

    res.cookies.set("accessToken", newAccessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    res.cookies.set("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return res;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}