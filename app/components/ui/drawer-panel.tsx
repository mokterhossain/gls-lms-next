"use client";

import { X } from "lucide-react";
import { useDrawer } from "./drawer";
import { useEffect } from "react";

export default function DrawerPanel() {
  const { open, closeDrawer, content, title } = useDrawer();

  /* LOCK SCROLL */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [open]);

  /* ESC CLOSE */
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };

    if (open) window.addEventListener("keydown", handleEsc);

    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, closeDrawer]);

  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={closeDrawer}
        className={`fixed inset-0 z-40 transition-all duration-500
        ${open
          ? "bg-black/40 backdrop-blur-md opacity-100"
          : "opacity-0 pointer-events-none"
        }`}
        style={{
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* DRAWER */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[520px]
        flex flex-col shadow-2xl
        transition-all duration-500
        ${open
          ? "translate-x-0 opacity-100 scale-100"
          : "translate-x-[110%] opacity-80 scale-[0.97]"
        }`}
        style={{
          background: "var(--surface)",
          transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* HEADER */}
        <div
          className="flex items-center justify-between px-5 py-4 border-b sticky top-0 z-10"
          style={{
            borderColor: "var(--border)",
            background: "var(--surface)",
          }}
        >
          <h2 className="font-semibold text-lg">
            {title || "Details"}
          </h2>

          <button
            onClick={closeDrawer}
            className="p-2 rounded-lg hover:bg-black/5 transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-5 py-4 custom-scroll">
          {content}
        </div>
      </div>
    </>
  );
}