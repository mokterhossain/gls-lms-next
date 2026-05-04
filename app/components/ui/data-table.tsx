"use client";

type Column<T> = {
  key: keyof T | string;
  label: string;
  align?: "left" | "right" | "center";
  render?: (row: T) => React.ReactNode;
};

type Props<T> = {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  emptyText?: string;
  renderActions?: (row: T) => React.ReactNode;
};

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  loading,
  emptyText = "No data found",
  renderActions,
}: Props<T>) {
  return (
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b" style={{ borderColor: "var(--border)" }}>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`p-3 text-${col.align || "left"}`}
              >
                {col.label}
              </th>
            ))}

            {renderActions && (
              <th className="p-3 text-right">Actions</th>
            )}
          </tr>
        </thead>

        <tbody>
          {/* LOADING */}
          {loading && (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="p-6 text-center opacity-60">
                Loading...
              </td>
            </tr>
          )}

          {/* EMPTY */}
          {!loading && data.length === 0 && (
            <tr>
              <td colSpan={columns.length + (renderActions ? 1 : 0)} className="p-6 text-center opacity-60">
                {emptyText}
              </td>
            </tr>
          )}

          {/* DATA */}
          {!loading &&
            data.map((row) => (
              <tr
                key={row.id}
                className="border-b hover:bg-[var(--primary-soft)]/20 transition"
                style={{ borderColor: "var(--border)" }}
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`p-3 text-${col.align || "left"}`}
                  >
                    {col.render
                      ? col.render(row)
                      : (row as any)[col.key]}
                  </td>
                ))}

                {renderActions && (
                  <td className="p-3">
                    <div className="flex justify-end gap-2">
                      {renderActions(row)}
                    </div>
                  </td>
                )}
              </tr>
            ))}
        </tbody>
      </table>
  );
}