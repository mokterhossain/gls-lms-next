import { prisma } from "@/lib/prisma";
import { withContext } from "@/lib/with-context";
import { NextResponse } from "next/server";

export const GET = withContext(async () => {
  const organizations = await prisma.organization.findMany({
    orderBy: { name: "asc" },
  });
  return NextResponse.json(organizations);
});

export const POST = withContext(async (req: Request) => {
  const body = await req.json();
  const organization = await prisma.organization.create({
    data: body,
  });
  return NextResponse.json(organization);
});

export const PUT = withContext(async (req: Request) => {
  const body = await req.json();
  const organization = await prisma.organization.update({
    where: { id: body.id },
    data: body,
  });
  return NextResponse.json(organization);
});

export const DELETE = withContext(async (req: Request) => {
  const body = await req.json();
  await prisma.organization.delete({
    where: { id: body.id },
  });
  return NextResponse.json({ success: true });
});