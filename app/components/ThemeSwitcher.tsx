"use client";

import { useTheme } from "@/app/context/theme-context";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  const themes = [
    { id: "indigo", color: "#4f46e5" },
    { id: "blue", color: "#2563eb" },
    { id: "emerald", color: "#10b981" },
  ];

  return (
    <div className="flex gap-2 items-center">
      {themes.map((t) => (
        <button
          key={t.id}
          onClick={() => setTheme(t.id)}
          className="w-5 h-5 rounded-full relative"
          style={{ background: t.color }}
        >
          {theme === t.id && (
            <span className="absolute inset-0 rounded-full ring-2 ring-black/30 animate-pulse" />
          )}
        </button>
      ))}
    </div>
  );
}