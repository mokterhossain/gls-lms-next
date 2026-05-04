import { prisma } from "@/lib/prisma";
import { RequestContext } from "@/lib/request-context";

type AuditInput = {
  action: "CREATE" | "UPDATE" | "DELETE";
  entityType: string;
  entityId?: string;
  oldValue?: any;
  newValue?: any;
};

export async function createAuditLog(input: AuditInput) {
  const ctx = RequestContext.get();

  try {
    await prisma.auditLog.create({
      data: {
        userId: ctx?.userId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        oldValue: input.oldValue ?? null,
        newValue: input.newValue ?? null,
        ipAddress: ctx?.ip,
      },
    });
  } catch (err) {
    console.error("Audit log failed:", err);
  }
}