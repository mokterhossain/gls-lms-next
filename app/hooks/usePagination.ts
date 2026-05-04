import { useEffect, useMemo, useState } from "react";

export function usePagination<T>(data: T[], defaultPageSize = 5) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return data.slice(start, start + pageSize);
  }, [data, page, pageSize]);

  // reset page when data changes
  useEffect(() => {
    setPage(1);
  }, [data, pageSize]);

  return {
    page,
    setPage,
    pageSize,
    setPageSize,
    totalPages,
    paginatedData,
  };
}