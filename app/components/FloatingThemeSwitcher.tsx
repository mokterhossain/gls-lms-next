"use client";

import { useState,useEffect, useRef } from "react";
import { useTheme } from "@/app/context/theme-context";
import { Palette } from "lucide-react";

export default function FloatingThemeSwitcher() {
  const { theme, setTheme, mode, setMode } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const themes = [
    "indigo",
    "blue",
    "emerald",
    "rose",
    "amber",
    "violet",
    "cyan",
    "slate",
  ];

  const modes = [
    "light",
    "dark",
    "dim",
    "oled",
    "midnight",
    "contrast",
    "soft",
    "neutral",
    "warm",
    "cool",
  ];
  useEffect(() => {
  function handleClickOutside(event: MouseEvent) {
    if (
      panelRef.current &&
      !panelRef.current.contains(event.target as Node)
    ) {
      setOpen(false);
    }
  }

  if (open) {
    document.addEventListener("mousedown", handleClickOutside);
  }

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, [open]);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-[9999] flex flex-col items-end gap-3">

      {open && (
  <div
    ref={panelRef}
    className="p-4 rounded-2xl shadow-xl border space-y-4"
    style={{
      background: "var(--surface)",
      borderColor: "var(--border)",
    }}
  >
          {/* COLORS */}
          <div className="grid grid-cols-4 gap-2">
            {themes.map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t as any)}
                className="w-6 h-6 rounded-full"
                style={{
                  background:
                    t === "indigo"
                      ? "#4f46e5"
                      : t === "blue"
                      ? "#2563eb"
                      : t === "emerald"
                      ? "#10b981"
                      : t === "rose"
                      ? "#f43f5e"
                      : t === "amber"
                      ? "#f59e0b"
                      : t === "violet"
                      ? "#7c3aed"
                      : t === "cyan"
                      ? "#06b6d4"
                      : "#475569",
                }}
              />
            ))}
          </div>

          {/* MODES */}
          <div className="grid grid-cols-2 gap-2">
            {modes.map((m) => (
              <button
                key={m}
                onClick={() => setMode(m as any)}
                className="px-2 py-1 text-xs rounded-md capitalize"
                style={{
                  background:
                    mode === m ? "var(--primary-soft)" : "transparent",
                  color: "var(--text)",
                }}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg"
        style={{
          background: "var(--primary)",
          color: "white",
        }}
      >
        <Palette size={20} />
      </button>
    </div>
  );
}