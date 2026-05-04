"use client";

import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";

import { useDrawer } from "@/app/components/ui/drawer";
import { useConfirm } from "@/app/components/ui/confirm-dialog";
import { useToast } from "@/app/components/ui/toast-provider";

import OrganizationForm from "./organization-form";
import TableSkeleton from "@/app/components/ui/table-skeleton";

import Pagination from "@/app/components/ui/pagination";
import { usePagination } from "@/app/hooks/usePagination";
import PageHeader from "@/app/components/ui/page-header";
import DataTable from "@/app/components/ui/data-table";

type Organization = {
  id: string;
  name: string;
};

export default function OrganizationsPage() {
  const { openDrawer } = useDrawer();
  const { confirm } = useConfirm();
  const { showToast } = useToast();

  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const columns = [
  {
    key: "name",
    label: "Name",
    render: (row: Organization) => (
      <span className="font-medium">{row.name}</span>
    ),
  },
];

  /* ================= FETCH ================= */
  const fetchOrganizations = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/organizations");

      if (!res.ok) throw new Error();

      const data = await res.json();
      setOrganizations(data);
    } catch {
      showToast("error", "Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  /* ================= SEARCH ================= */
  const filtered = useMemo(() => {
    const s = search.toLowerCase();

    return organizations.filter((org) =>
      org.name.toLowerCase().includes(s)
    );
  }, [organizations, search]);

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
      title: "Delete Organization",
      message: "This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",

      onConfirm: async () => {
        try {
          const res = await fetch("/api/organizations", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id }),
          });

          if (!res.ok) throw new Error();

          showToast("success", "Organization deleted");

          fetchOrganizations();
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
        title="Organizations"
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search organizations..."
        right={
          <button
            onClick={() =>
              openDrawer(
                "Create Organization",
                <OrganizationForm onSaved={fetchOrganizations} />,
              )
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
          emptyText="No organizations found"
          renderActions={(org) => (
            <>
              <button
                onClick={() =>
                  openDrawer(
                    "Edit Organization",
                    <OrganizationForm
                      organization={org}
                      onSaved={fetchOrganizations}
                    />,
                  )
                }
                className="p-2 rounded-lg hover:bg-[var(--primary-soft)]"
              >
                <Pencil size={16} />
              </button>

              <button
                onClick={() => handleDelete(org.id)}
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