"use client";

import { useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import TableSkeleton from "@/app/components/ui/table-skeleton";
import Pagination from "@/app/components/ui/pagination";
import { usePagination } from "@/app/hooks/usePagination";
import DataTable from "@/app/components/ui/data-table";
import PageHeader from "@/app/components/ui/page-header";

type Audit = {
  id: string;
  action: string;
  entityType: string;
  entityId?: string;
  userId?: string;
  ipAddress?: string;
  createdAt: string;
  user?: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
  };
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<Audit[]>([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");

  //const [page, setPage] = useState(1);
  //const [pageSize, setPageSize] = useState(5);

  //const [totalPages, setTotalPages] = useState(1);
  const columns = [
  {
    key: "action",
    label: "Action",
    render: (row: Audit) => (
      <span className="font-medium">{row.action}</span>
    ),
  },
  {
    key: "entityType",
    label: "Entity Type",
    render: (row: Audit) => (
      <span className="font-medium">{row.entityType}</span>
    ),
  },
  {
    key: "username",
    label: "User",
    render: (row: Audit) => (
      <span className="font-medium">{row.user?.username || "-"}</span>
    ),
  },
  {
    key: "ipAddress",
    label: "IP Address",
    render: (row: Audit) => (
      <span className="font-medium">{row.ipAddress || "-"}</span>
    ),
  },
  {
    key: "createdAt",
    label: "Created At",
    render: (row: Audit) => (
      <span className="font-medium">{new Date(row.createdAt).toLocaleString()}</span>
    ),
  },
];

  /* ================= FETCH ================= */
  const fetchLogs = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/audit-logs`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();
      setLogs(data || []);
      //setTotalPages(data.totalPages || 1);
    } catch {
      console.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchLogs();
  }, []);
  /* useEffect(() => {
    fetchLogs();
  }, [page, pageSize, search]);*/

  /* ================= SEARCH ================= */
    const filtered = useMemo(() => {
      const s = search.toLowerCase();
  
      return logs.filter((log) =>
        log.action.toLowerCase().includes(s) || 
        log.entityType.toLowerCase().includes(s) ||
        log.user?.username?.toLowerCase().includes(s) ||
        log.ipAddress?.toLowerCase().includes(s)
      );
    }, [logs, search]);
  
    /* ================= GLOBAL PAGINATION ================= */
    const {
      page,
      setPage,
      pageSize,
      setPageSize,
      totalPages,
      paginatedData,
    } = usePagination(filtered, 5);

  /* ================= RESET PAGE ================= */
  useEffect(() => {
    setPage(1);
  }, [search, pageSize]);

  const getUserName = (user: any) => {
  if (!user) return "-";

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return fullName || user.username || user.email || "-";
};

  /* ================= UI ================= */
  return (
    <div className="space-y-5">
      {/* HEADER */}
      <PageHeader
        title="Audit Logs"
        search={search}
        setSearch={setSearch}
        searchPlaceholder="Search audit logs..."
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
          emptyText="No audit logs found"
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