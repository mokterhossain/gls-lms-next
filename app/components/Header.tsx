"use client";

import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  /* ================= OUTSIDE CLICK CLOSE ================= */
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        notifRef.current &&
        !notifRef.current.contains(e.target as Node)
      ) {
        setNotifOpen(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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
    <header
      className="h-16 flex items-center justify-between px-6 border-b relative"
      style={{
        background: "var(--header-bg)",
        borderColor: "var(--border)",
      }}
    >
      {/* TITLE */}
      <h1 className="font-semibold text-lg">Dashboard</h1>

      <div className="flex items-center gap-5">

        {/* ================= NOTIFICATIONS ================= */}
        <div ref={notifRef} className="relative">

          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative p-2 rounded-lg hover:opacity-80 transition"
          >
            <Bell size={18} />

            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ background: "var(--primary)" }}
            />
          </button>

          {notifOpen && (
            <div
              className="absolute right-0 top-12 w-72 rounded-xl border shadow-xl p-2 z-50"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <p className="text-sm font-medium px-2 py-1">
                Notifications
              </p>

              <div
                className="border-t my-1"
                style={{ borderColor: "var(--border)" }}
              />

              <div className="text-sm px-2 py-2 opacity-70">
                No new notifications
              </div>
            </div>
          )}
        </div>

        {/* ================= PROFILE ================= */}
        <div ref={profileRef} className="relative">

          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="w-8 h-8 rounded-full hover:opacity-90 transition"
            style={{
              background:
                "linear-gradient(135deg, var(--primary), #a78bfa)",
            }}
          />

          {profileOpen && (
            <div
              className="absolute right-0 top-12 w-56 rounded-xl border shadow-xl p-2 z-50"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {/* PROFILE INFO */}
              <div className="px-3 py-2">
                <p className="text-sm font-medium">Admin User</p>
                <p className="text-xs opacity-60">
                  admin@company.com
                </p>
              </div>

              <div
                className="border-t my-1"
                style={{ borderColor: "var(--border)" }}
              />

              {/* ACTIONS */}
              <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-black/5">
                👤 Profile
              </button>

              <button className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-black/5">
                ⚙️ Settings
              </button>

              {/* LOGOUT */}
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
    </header>
  );
}