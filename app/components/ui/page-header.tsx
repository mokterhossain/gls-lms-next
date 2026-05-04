"use client";

import { ReactNode } from "react";
import { Search } from "lucide-react";

type Props = {
  title: string;

  search?: string;
  setSearch?: (value: string) => void;
  searchPlaceholder?: string;

  right?: ReactNode; // buttons (Add / filters etc.)
};

export default function PageHeader({
  title,
  search,
  setSearch,
  searchPlaceholder = "Search...",
  right,
}: Props) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

      {/* TITLE */}
      <h1 className="text-xl font-semibold">{title}</h1>

      {/* RIGHT SIDE */}
      <div className="flex gap-2 w-full sm:w-auto">

        {/* SEARCH */}
        {setSearch && (
          <div className="relative w-full sm:w-64">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border outline-none"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            />
          </div>
        )}

        {/* ACTIONS */}
        {right}
      </div>
    </div>
  );
}