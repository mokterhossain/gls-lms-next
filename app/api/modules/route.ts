import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { withContext } from "@/lib/with-context";

/* ================= GET ================= */
export const GET = withContext(async () => {
  const modules = await prisma.module.findMany({
    orderBy: { name: "asc" },
  });

  return NextResponse.json(modules);
});

/* ================= CREATE ================= */
export const POST = withContext(async (req: Request) => {
  const body = await req.json();

  const module = await prisma.module.create({
    data: {
      name: body.name,
      description: body.description ?? null,
    },
  });

  return NextResponse.json(module);
});

/* ================= UPDATE ================= */
export const PUT = withContext(async (req: Request) => {
  const body = await req.json();

  const module = await prisma.module.update({
    where: { id: body.id },
    data: {
      name: body.name,
      description: body.description ?? null,
    },
  });

  return NextResponse.json(module);
});

/* ================= DELETE ================= */
export const DELETE = withContext(async (req: Request) => {
  const body = await req.json();

  await prisma.module.delete({
    where: { id: body.id },
  });

  return NextResponse.json({ success: true });
});