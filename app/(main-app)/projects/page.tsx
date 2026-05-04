"use client";

import { useMemo, useState } from "react";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useDrawer } from "@/app/components/drawer-provider";

/* ================= DATA ================= */

const statuses = ["Active", "Completed", "On Hold"] as const;

const clients = [
  "Bengal Meat",
  "Guardian Lab",
  "Mercantile Bank",
  "Assurant",
  "Internal",
];

const getProgress = (id: number, status: string) => {
  if (status === "Completed") return 100;
  return 30 + (id % 60);
};

const projects = Array.from({ length: 500 }).map((_, i) => {
  const status = statuses[i % statuses.length];

  return {
    id: i + 1,
    name: `Project ${i + 1}`,
    client: clients[i % clients.length],
    status,
    progress: getProgress(i + 1, status),
    due: `2026-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
  };
});

/* ================= TYPES ================= */

type SortKey = "name" | "client" | "status" | "progress" | "due";

export default function ProjectsPage() {
  const { openDrawer } = useDrawer();

  const [search, setSearch] = useState("");
  const [tab, setTab] =
    useState<"All" | "Active" | "Completed" | "On Hold">("All");

  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  /* ================= COUNTS ================= */

  const tabCounts = useMemo(() => ({
    All: projects.length,
    Active: projects.filter(p => p.status === "Active").length,
    Completed: projects.filter(p => p.status === "Completed").length,
    "On Hold": projects.filter(p => p.status === "On Hold").length,
  }), []);

  /* ================= FILTER + SORT ================= */

  const filtered = useMemo(() => {
    let data = projects;

    if (tab !== "All") {
      data = data.filter(p => p.status === tab);
    }

    if (search.trim()) {
      const s = search.toLowerCase();
      data = data.filter(
        p =>
          p.name.toLowerCase().includes(s) ||
          p.client.toLowerCase().includes(s)
      );
    }

    data = [...data].sort((a, b) => {
      let A: any = a[sortKey];
      let B: any = b[sortKey];

      if (typeof A === "string") A = A.toLowerCase();
      if (typeof B === "string") B = B.toLowerCase();

      return sortDir === "asc" ? (A > B ? 1 : -1) : (A < B ? 1 : -1);
    });

    return data;
  }, [search, tab, sortKey, sortDir]);

  /* ================= PAGINATION ================= */

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page, pageSize]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  const SortIcon = (key: SortKey) => {
    if (sortKey !== key) return null;
    return sortDir === "asc" ? " ↑" : " ↓";
  };

  /* ================= UI ================= */

  return (
    <div className="space-y-5">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">

        <h1 className="text-xl font-semibold">Projects</h1>

        <div className="flex gap-3 items-center w-full sm:w-auto">

          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search projects..."
            className="px-3 py-2 text-sm rounded-xl border w-full sm:w-64"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          />

          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="px-2 py-2 text-sm rounded-xl border"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>

        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap gap-2">

        {(["All", "Active", "Completed", "On Hold"] as const).map(t => (
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setPage(1);
            }}
            className="px-3 py-1 text-xs rounded-full transition"
            style={{
              background: tab === t ? "var(--primary)" : "var(--primary-soft)",
              color: tab === t ? "#fff" : "var(--primary)",
            }}
          >
            {t} ({tabCounts[t]})
          </button>
        ))}

      </div>

      {/* TABLE */}
      <div className="hidden md:block border rounded-2xl overflow-x-auto"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <table className="w-full min-w-[1000px] text-sm">

          <thead>
            <tr className="border-b text-left">

              <th className="p-3 cursor-pointer" onClick={() => handleSort("name")}>
                Project{SortIcon("name")}
              </th>

              <th className="cursor-pointer" onClick={() => handleSort("client")}>
                Client{SortIcon("client")}
              </th>

              <th className="cursor-pointer" onClick={() => handleSort("status")}>
                Status{SortIcon("status")}
              </th>

              <th className="cursor-pointer" onClick={() => handleSort("progress")}>
                Progress{SortIcon("progress")}
              </th>

              <th className="cursor-pointer" onClick={() => handleSort("due")}>
                Due{SortIcon("due")}
              </th>

              <th className="text-right p-3">Actions</th>

            </tr>
          </thead>

          <tbody>
            {paginated.map(p => (
              <tr
                key={p.id}
                className="border-b hover:bg-[var(--primary-soft)]/20"
              >
                <td className="p-3 font-medium">{p.name}</td>
                <td>{p.client}</td>
                <td>{p.status}</td>
                <td>{p.progress}%</td>
                <td>{p.due}</td>

                {/* ACTIONS */}
                <td className="text-right p-3">
                  <div className="flex justify-end gap-2">

                    <button
                      onClick={() => openDrawer("details", p)}
                      className="p-2 rounded-lg hover:bg-[var(--primary-soft)]"
                    >
                      <Eye size={16} />
                    </button>

                    <button
                      onClick={() => openDrawer("edit", p)}
                      className="p-2 rounded-lg hover:bg-[var(--primary-soft)]"
                    >
                      <Pencil size={16} />
                    </button>

                    <button className="p-2 rounded-lg hover:bg-red-500/10 text-red-500">
                      <Trash2 size={16} />
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* MOBILE */}
      <div className="md:hidden space-y-3">

        {paginated.map(p => (
          <div key={p.id}
            className="p-4 border rounded-xl"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          >
            <div className="flex justify-between">
              <h3 className="font-semibold">{p.name}</h3>
              <span className="text-xs">{p.status}</span>
            </div>

            <p className="text-sm opacity-70">{p.client}</p>
            <p className="text-sm mt-1">Progress: {p.progress}%</p>

            <div className="flex justify-end gap-2 mt-3">

              <button onClick={() => openDrawer("details", p)}
                className="p-2 bg-gray-100 rounded-lg">
                <Eye size={14} />
              </button>

              <button onClick={() => openDrawer("edit", p)}
                className="p-2 bg-gray-100 rounded-lg">
                <Pencil size={14} />
              </button>

            </div>

          </div>
        ))}

      </div>

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 flex-wrap">

        <button onClick={() => setPage(1)} disabled={page === 1}
          className="px-3 py-1 text-xs border rounded-full disabled:opacity-40">
          First
        </button>

        <button onClick={() => setPage(p => Math.max(p - 1, 1))}
          disabled={page === 1}
          className="px-3 py-1 text-xs border rounded-full disabled:opacity-40">
          Prev
        </button>

        <span className="px-3 text-xs">
          Page {page} / {totalPages}
        </span>

        <button onClick={() => setPage(p => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
          className="px-3 py-1 text-xs border rounded-full disabled:opacity-40">
          Next
        </button>

        <button onClick={() => setPage(totalPages)}
          disabled={page === totalPages}
          className="px-3 py-1 text-xs border rounded-full disabled:opacity-40">
          Last
        </button>

      </div>

    </div>
  );
}