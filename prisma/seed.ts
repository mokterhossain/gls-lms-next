import { CrudAction } from "../generated/prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
//const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding started...");

  /* ================= ORG ================= */

  const org = await prisma.organization.upsert({
    where: { id: "org-1" },
    update: {},
    create: {
      id: "org-1",
      name: "Default Organization",
    },
  });

  const branch = await prisma.branch.upsert({
    where: { id: "branch-1" },
    update: {},
    create: {
      id: "branch-1",
      name: "Head Office",
      organizationId: org.id,
    },
  });

  /* ================= MODULES ================= */

  const modules = ["PROJECT", "USER", "ROLE"];

  const moduleRecords = await Promise.all(
    modules.map((name) =>
      prisma.module.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );

  /* ================= PERMISSIONS ================= */

  const permissions = [];

  for (const mod of moduleRecords) {
    for (const action of Object.values(CrudAction)) {
      const perm = await prisma.permission.upsert({
        where: {
          moduleId_action: {
            moduleId: mod.id,
            action,
          },
        },
        update: {},
        create: {
          moduleId: mod.id,
          action,
        },
      });

      permissions.push(perm);
    }
  }

  /* ================= ROLE ================= */

  const adminRole = await prisma.role.upsert({
    where: { name: "ADMIN" },
    update: {},
    create: {
      name: "ADMIN",
      description: "Full system access",
    },
  });

  /* ================= ROLE PERMISSIONS ================= */

  await prisma.rolePermission.deleteMany({
    where: { roleId: adminRole.id },
  });

  await prisma.rolePermission.createMany({
    data: permissions.map((p) => ({
      roleId: adminRole.id,
      permissionId: p.id,
    })),
  });

  /* ================= USER ================= */

  const passwordHash = await bcrypt.hash("Admin@123", 10);

  const user = await prisma.user.upsert({
    where: { email: "admin@gls.com" },
    update: {},
    create: {
      username: "admin",
      email: "admin@gls.com",
      passwordHash,
      isActive: true,
      isVerified: true,
    },
  });

  /* ================= USER ORGANIZATION ================= */

  await prisma.userOrganization.upsert({
    where: {
      userId_organizationId: {
        userId: user.id,
        organizationId: org.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      organizationId: org.id,
      isOwner: true,
    },
  });

  /* ================= USER ROLE ================= */

  await prisma.userRole.upsert({
    where: {
      userId_roleId_organizationId_branchId: {
        userId: user.id,
        roleId: adminRole.id,
        organizationId: org.id,
        branchId: branch.id,
      },
    },
    update: {},
    create: {
      userId: user.id,
      roleId: adminRole.id,
      organizationId: org.id,
      branchId: branch.id,
    },
  });

  console.log("✅ Seed completed!");
  console.log("👤 Login with:");
  console.log("Email: admin@gls.com");
  console.log("Password: Admin@123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });