import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { RequestContext } from "./request-context";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const base = new PrismaClient({ adapter });

function extractId(data: any): string | null {
  if (!data) return null;

  // single object with id
  if (typeof data === "object" && "id" in data) {
    return data.id;
  }

  return null;
}

function safeJson(data: any) {
  if (!data) return undefined;
  return JSON.parse(JSON.stringify(data));
}

export const prisma = base.$extends({
  query: {
    $allModels: {
      async $allOperations({ model, operation, args, query }) {
        const ctx = RequestContext.get();

        const isWrite = ["create", "update", "delete"].includes(operation);

        let oldValue: any = null;

        /* =========================
           SAFE OLD VALUE
        ========================= */
        if (
          (operation === "update" || operation === "delete") &&
          model !== "AuditLog" &&
          "where" in args &&
          args.where
        ) {
          try {
            oldValue = await (base as any)[model].findUnique({
              where: args.where,
            });
          } catch {}
        }

        const result = await query(args);

        /* =========================
           AUTO AUDIT LOG
        ========================= */
        if (isWrite && model !== "AuditLog") {
          try {
            await base.auditLog.create({
              data: {
                userId: ctx?.userId ?? null,
                ipAddress: ctx?.ip ?? null,

                action: operation.toUpperCase(),
                entityType: model,

                entityId:
                  extractId(result) ||
                  extractId(oldValue) ||
                  null,

                oldValue: safeJson(oldValue),
                newValue: safeJson(result),
              },
            });
          } catch (err) {
            console.error("Audit log failed:", err);
          }
        }

        return result;
      },
    },
  },
});