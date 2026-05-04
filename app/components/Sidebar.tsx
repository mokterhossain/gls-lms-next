"use client";

import Link from "next/link";
import {
  LayoutDashboard,
  BarChart3,
  FolderKanban,
  ClipboardList,
  Users,
  Settings,
  Activity,
  X,
  Menu,
  Shield,
  ShieldCheck,
  FileText,
  Lock,
  Key,
  ChevronDown,
} from "lucide-react";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import SidebarProfile from "./SidebarProfile";

/* ================= MENU ================= */

const menu = [
  {
    section: "OVERVIEW",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Analytics", href: "/analytics", icon: BarChart3 },
      { name: "Activity Log", href: "/audit-logs", icon: Activity },
    ],
  },
  {
    section: "ORGANIZATION",
    items: [
      { name: "Organizations", href: "/organizations", icon: Users },
      { name: "Branches", href: "/branches", icon: FolderKanban },
      { name: "Users", href: "/users", icon: Users },
      { name: "User Roles", href: "/user-roles", icon: ClipboardList },
    ],
  },
  {
    section: "RBAC",
    items: [
      { name: "Roles", href: "/roles", icon: Shield },
      { name: "Permissions", href: "/permissions", icon: ShieldCheck },
      { name: "Modules", href: "/modules", icon: FolderKanban },
    ],
  },
  {
    section: "ABAC",
    items: [{ name: "Policies", href: "/policies", icon: FileText }],
  },
  {
    section: "SECURITY",
    items: [
      { name: "Sessions", href: "/sessions", icon: Lock },
      { name: "Tokens", href: "/tokens", icon: Key },
    ],
  },
  {
    section: "SYSTEM",
    items: [{ name: "Settings", href: "/settings", icon: Settings }],
  },
];

/* ================= SIDEBAR ================= */

export default function Sidebar() {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const [open, setOpen] = useState(false);

  // 🔥 NEW: section toggle state
  const [openSections, setOpenSections] = useState<string[]>([
    "OVERVIEW",
  ]);

  const toggleSection = (section: string) => {
    setOpenSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section]
    );
  };

  /* ================= PERSIST SIDEBAR ================= */
  useEffect(() => {
    const saved = localStorage.getItem("sidebar");
    if (saved === "collapsed") setCollapsed(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div
        className="md:hidden flex items-center justify-between px-4 h-14 border-b"
        style={{ borderColor: "var(--border)" }}
      >
        <button onClick={() => setOpen(true)}>
          <Menu />
        </button>
        <span className="font-semibold">GLS LIMS</span>
      </div>

      {/* OVERLAY */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed md:static top-0 left-0 z-50 h-full
          bg-[var(--sidebar-bg)] border-r
          transition-all duration-300
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
        style={{
          width: collapsed ? "80px" : "260px",
          borderColor: "var(--border)",
        }}
      >
        {/* HEADER */}
        <div
          className="h-14 flex items-center justify-between px-3 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          {!collapsed && <span className="font-semibold">GLS LIMS</span>}

          <div className="flex gap-2">
            <button
              className="hidden md:block"
              onClick={() => setCollapsed(!collapsed)}
            >
              ☰
            </button>

            <button className="md:hidden" onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>
        </div>

        {/* MENU */}
        <nav className="px-2 py-3 space-y-3 overflow-y-auto h-[calc(100%-120px)]">

          {menu.map((group) => {
            const isOpen = openSections.includes(group.section);

            return (
              <div key={group.section}>

                {/* 🔥 SECTION HEADER (CLICKABLE) */}
                {!collapsed && (
                  <button
                    onClick={() => toggleSection(group.section)}
                    className="w-full flex items-center justify-between px-3 py-2 text-[11px] uppercase text-gray-400 hover:text-[var(--primary)] transition"
                  >
                    <span>{group.section}</span>

                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}

                {/* 🔥 ITEMS */}
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    isOpen || collapsed ? "max-h-[500px]" : "max-h-0"
                  }`}
                >
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const active = pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition"
                        style={{
                          justifyContent: collapsed
                            ? "center"
                            : "flex-start",
                          background: active
                            ? "var(--primary-soft)"
                            : "transparent",
                          color: active
                            ? "var(--primary)"
                            : "var(--muted)",
                        }}
                      >
                        <Icon size={18} />
                        {!collapsed && <span>{item.name}</span>}
                      </Link>
                    );
                  })}
                </div>

              </div>
            );
          })}

        </nav>

        {/* PROFILE */}
        <div
          className="absolute bottom-0 w-full border-t"
          style={{ borderColor: "var(--border)" }}
        >
          <SidebarProfile collapsed={collapsed} />
        </div>
      </aside>
    </>
  );
}