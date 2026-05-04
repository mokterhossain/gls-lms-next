"use client";

import { useDrawer } from "./drawer-provider";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function GlobalDrawer() {
  const { isOpen, type, data, closeDrawer } = useDrawer();

  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  /* ================= ANIMATION CONTROL ================= */
  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
    } else {
      setVisible(false);
      const t = setTimeout(() => setMounted(false), 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  /* ================= 🚨 FIX: LOCK MAIN PAGE SCROLL ================= */
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  /* ================= ESC CLOSE ================= */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 z-50 flex">

      {/* ================= BACKDROP ================= */}
      <div
        onClick={closeDrawer}
        className={`
          absolute inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300 ease-out
          ${visible ? "opacity-100" : "opacity-0"}
        `}
      />

      {/* ================= DRAWER ================= */}
      <div
        className={`
          relative ml-auto h-full w-full sm:w-[480px]
          bg-[var(--surface)] border-l shadow-2xl
          flex flex-col

          transform-gpu will-change-transform
          transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]
        `}
        style={{
          transform: visible
            ? "translateX(0%)"
            : "translateX(100%)",
        }}
      >

        {/* ================= HEADER ================= */}
        <div
          className="flex items-center justify-between p-4 border-b"
          style={{ borderColor: "var(--border)" }}
        >
          <div>
            <h2 className="font-semibold text-lg">
              {type === "edit" ? "Edit Project" : "Project Details"}
            </h2>
            <p className="text-xs opacity-60">ID: {data?.id}</p>
          </div>

          <button
            onClick={closeDrawer}
            className="p-2 rounded-lg hover:bg-[var(--primary-soft)] transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* ================= CONTENT WRAPPER ================= */}
        <div className="flex-1 flex flex-col min-h-0">

          {/* ================= SCROLLABLE CONTENT ================= */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 drawer-scroll">

            {data && (
              <>
                <div>
                  <p className="text-xs opacity-60">Project</p>
                  <p className="font-medium">{data.name}</p>
                </div>

                <div>
                  <p className="text-xs opacity-60">Client</p>
                  <p>{data.client}</p>
                </div>

                <div>
                  <p className="text-xs opacity-60">Status</p>
                  <p>{data.status}</p>
                </div>

                <div>
                  <p className="text-xs opacity-60 mb-1">Progress</p>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full transition-all duration-300"
                      style={{
                        width: `${data.progress}%`,
                        background: "var(--primary)",
                      }}
                    />
                  </div>
                </div>

                {/* EDIT MODE */}
                {type === "edit" && (
                  <div className="space-y-3 pt-4 border-t"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <input
                      defaultValue={data.name}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />

                    <input
                      defaultValue={data.client}
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />

                    <textarea
                      placeholder="Project notes..."
                      className="w-full px-3 py-2 border rounded-lg text-sm min-h-[120px]"
                    />
                    <textarea
                      placeholder="Project notes..."
                      className="w-full px-3 py-2 border rounded-lg text-sm min-h-[120px]"
                    />
                    <textarea
                      placeholder="Project notes..."
                      className="w-full px-3 py-2 border rounded-lg text-sm min-h-[120px]"
                    />
                    <textarea
                      placeholder="Project notes..."
                      className="w-full px-3 py-2 border rounded-lg text-sm min-h-[120px]"
                    />

                    <textarea
                      placeholder="Project notes..."
                      className="w-full px-3 py-2 border rounded-lg text-sm min-h-[120px]"
                    />
                  </div>
                )}

              </>
            )}

          </div>

          {/* ================= FIXED FOOTER ================= */}
          {type === "edit" && (
            <div
              className="p-4 border-t bg-[var(--surface)]"
              style={{ borderColor: "var(--border)" }}
            >
              <button
                className="w-full py-2 rounded-xl text-white font-medium
                transition active:scale-[0.98]"
                style={{ background: "var(--primary)" }}
              >
                Save Changes
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}