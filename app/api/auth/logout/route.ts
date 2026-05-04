import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function POST() {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (refreshToken) {
    await prisma.session.updateMany({
      where: { refreshToken },
      data: { revoked: true },
    });
  }

  const res = NextResponse.json({ success: true });

  res.cookies.set("accessToken", "", {
    path: "/",
    expires: new Date(0),
  });

  res.cookies.set("refreshToken", "", {
    path: "/",
    expires: new Date(0),
  });

  return res;
}