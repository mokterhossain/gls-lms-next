"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Trash2, Plus, Search } from "lucide-react";

import { useDrawer } from "@/app/components/ui/drawer";
import ModuleForm from "./module-form";
import TableSkeleton from "@/app/components/ui/table-skeleton";
import { useConfirm } from "@/app/components/ui/confirm-dialog";
import { useToast } from "@/app/components/ui/toast-provider";
import Pagination from "@/app/components/ui/pagination";
import { usePagination } from "@/app/hooks/usePagination";
import PageHeader from "@/app/components/ui/page-header";
import DataTable from "@/app/components/ui/data-table";

type Module = {
  id: string;
  name: string;
  description?: string;
};

export default function ModulesPage() {
  const { openDrawer } = useDrawer();
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  const columns = [
  {
    key: "name",
    label: "Name",
    render: (row: Module) => (
      <span className="font-medium">{row.name}</span>
    ),
  },
  {
    key: "description",
    label: "Description",
    render: (row: Module) => (
      <span className="font-medium">{row.description}</span>
    ),
  },
];

  /* ================= FETCH ================= */
  const fetchModules = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/modules");

      if (!res.ok) throw new Error();

      const data = await res.json();
      setModules(data);
    } catch {
      showToast("error", "Failed to load modules");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, []);

  /* ================= SEARCH ================= */
  const filtered = useMemo(() => {
    const s = search.toLowerCase();

    return modules.filter(
      (m) =>
        m.name.toLowerCase().includes(s) ||
        (m.description || "").toLowerCase().includes(s)
    );
  }, [modules, search]);

  /* ================= GLOBAL PAGINATION ================= */
    const {
      page,
      setPage,
      pageSize,
      setPageSize,
      totalPages,
      paginatedData,
    } = usePagination(filtered, 5);

  /* ================= DELETE ================= */
  const handleDelete = (id: string) => {
    confirm({
      title: "Delete Module",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",

      onConfirm: async () => {
        try {
          const res = await fetch("/api/modules", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });

          if (!res.ok) throw new Error();

          showToast("success", "Module deleted");

          fetchModules();
        } catch {
          showToast("error", "Delete failed");
        }
      },
    });
  };

  /* ================= UI ================= */
  return (
    <div className="space-y-5">
      {/* HEADER */}
      <PageHeader
        title="Modules"
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search modules..."
        right={
          <button
            onClick={() =>
              openDrawer("Create Module", <ModuleForm onSaved={fetchModules} />)
            }
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
            style={{
              background: "var(--primary)",
              color: "#fff",
            }}
          >
            <Plus size={16} />
            Add
          </button>
        }
      />

      {/* TABLE */}
      <div
        className="rounded-2xl overflow-hidden border"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <DataTable
          columns={columns}
          data={paginatedData}
          loading={loading}
          emptyText="No modules found"
          renderActions={(mod) => (
            <>
              <button
                onClick={() =>
                  openDrawer(
                    "Edit Module",
                    <ModuleForm module={mod} onSaved={fetchModules} />,
                  )
                }
                className="p-2 rounded-lg hover:bg-[var(--primary-soft)]"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => handleDelete(mod.id)}
                className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        />

        {/* GLOBAL PAGINATION */}
        <Pagination
          page={page}
          totalPages={totalPages}
          pageSize={pageSize}
          setPage={setPage}
          setPageSize={setPageSize}
        />
      </div>
    </div>
  );
}