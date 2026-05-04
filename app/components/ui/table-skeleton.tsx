"use client";

import { Skeleton } from "./skeleton";

export default function TableSkeleton({
  rows = 5,
  columns = 3,
}: {
  rows?: number;
  columns?: number;
}) {
  return (
    <>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className="border-b"
          style={{ borderColor: "var(--border)" }}
        >
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className="p-3">
              <Skeleton className="h-4 w-full" />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
}