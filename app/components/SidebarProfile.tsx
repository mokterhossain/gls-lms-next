"use client";

import { useRouter } from "next/dist/client/components/navigation";
import { useEffect, useRef, useState } from "react";

export default function SidebarProfile({
  collapsed,
}: {
  collapsed: boolean;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  // close on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  /* ================= LOGOUT ================= */
  const handleLogout = async () => {
    try {
      setLoading(true);

      await fetch("/api/auth/logout", {
        method: "POST",
      });

      // optional cleanup
      localStorage.removeItem("user");

      router.push("/login");
      router.refresh();
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="p-3 border-t"
      style={{ borderColor: "var(--border)" }}
    >
      <div ref={ref} className="relative">

        {/* ===== TRIGGER BUTTON ===== */}
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center gap-3 p-2 rounded-xl hover:opacity-90 transition"
          style={{ background: "var(--surface)" }}
        >
          {/* Avatar */}
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "var(--primary-soft)" }}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
            >
              <path d="M20 21a8 8 0 0 0-16 0" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* Info */}
          {!collapsed && (
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs opacity-60">
                admin@company.com
              </p>
            </div>
          )}

          {/* Arrow */}
          {!collapsed && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              className={`transition-transform ${
                open ? "rotate-180" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          )}
        </button>

        {/* ===== DROPDOWN ===== */}
        {open && (
          <div
            className={`absolute bottom-14 z-50 rounded-xl border p-2 transition-all duration-200 ease-out
  ${collapsed
  ? "-left-1 w-56"
  : "left-0 w-full"
}
`}
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.12)",
            }}
          >
            {/* PROFILE */}
            <button
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-black/5 transition"
              onClick={() => (window.location.href = "/profile")}
            >
              👤 Profile
            </button>

            {/* SETTINGS */}
            <button
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-black/5 transition"
              onClick={() => (window.location.href = "/settings")}
            >
              ⚙️ Settings
            </button>

            {/* BILLING */}
            <button
              className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-black/5 transition"
            >
              💳 Billing
            </button>

            {/* DIVIDER */}
            <div
              className="my-1 border-t"
              style={{ borderColor: "var(--border)" }}
            />

            {/* SIGN OUT */}
            <button
                onClick={handleLogout}
                disabled={loading}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-500/10 disabled:opacity-50"
              >
                {loading ? "Signing out..." : "🚪 Sign out"}
              </button>
          </div>
        )}
      </div>
    </div>
  );
}