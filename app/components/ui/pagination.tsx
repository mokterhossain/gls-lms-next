"use client";

type Props = {
  page: number;
  totalPages: number;
  pageSize: number;
  setPage: (p: number) => void;
  setPageSize: (size: number) => void;
};

export default function Pagination({
  page,
  totalPages,
  pageSize,
  setPage,
  setPageSize,
}: Props) {
  return (
    <div
      className="flex flex-col sm:flex-row justify-between items-center gap-3 p-4 border-t"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* PAGE SIZE */}
      <div className="flex items-center gap-2 text-sm">
        <span className="opacity-70">Page size:</span>

        <select
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
          className="px-2 py-1 rounded-lg border text-sm"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          {[5, 10, 20].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      {/* NAV */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setPage(Math.max(page - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1.5 rounded-lg text-sm border transition disabled:opacity-40"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          Prev
        </button>

        <div
          className="px-3 py-1.5 rounded-lg text-sm"
          style={{
            background: "var(--primary-soft)",
            color: "var(--primary)",
            border: "1px solid var(--border)",
          }}
        >
          {page} / {totalPages}
        </div>

        <button
          onClick={() => setPage(Math.min(page + 1, totalPages))}
          disabled={page >= totalPages}
          className="px-3 py-1.5 rounded-lg text-sm border transition disabled:opacity-40"
          style={{
            background: "var(--surface)",
            borderColor: "var(--border)",
          }}
        >
          Next
        </button>
      </div>
    </div>
  );
}