import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma/client"; // 👈 IMPORTANT
import { withContext } from "@/lib/with-context";

export const GET = withContext(async () => {
  const auditLogs = await prisma.auditLog.findMany({
    orderBy: { entityType: "asc" },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          email: true,
        },
      },
    },
  });
  return NextResponse.json(auditLogs);
});

/* export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const page = Number(searchParams.get("page") || 1);
  const pageSize = Number(searchParams.get("pageSize") || 5);
  const search = searchParams.get("search") || "";

  const skip = (page - 1) * pageSize;

  // ================= SAFE WHERE ================= 
  let where: Prisma.AuditLogWhereInput = {};

  if (search) {
    where = {
      OR: [
        {
          action: {
            contains: search,
            mode: Prisma.QueryMode.insensitive, // ✅ FIX
          },
        },
        {
          entityType: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
        {
          userId: {
            contains: search,
            mode: Prisma.QueryMode.insensitive,
          },
        },
      ],
    };
  }

  // ================= COUNT ================= 
  const totalCount = await prisma.auditLog.count({ where });

  // ================= DATA ================= 
  const data = await prisma.auditLog.findMany({
    where,
    skip,
    take: pageSize,
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          username: true,
          email: true,
        },
      },
    },
  });

  const totalPages = Math.ceil(totalCount / pageSize);

  return NextResponse.json({
    data,
    totalPages,
    totalCount,
  });
} */