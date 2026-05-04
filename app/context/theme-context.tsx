"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme =
  | "indigo"
  | "blue"
  | "emerald"
  | "rose"
  | "amber"
  | "violet"
  | "cyan"
  | "slate";

type Mode =
  | "light"
  | "dark"
  | "dim"
  | "oled"
  | "midnight"
  | "contrast"
  | "soft"
  | "neutral"
  | "warm"
  | "cool";

const colorMap: Record<string, string> = {
  indigo: "#4f46e5",
  blue: "#2563eb",
  emerald: "#10b981",
  rose: "#f43f5e",
  amber: "#f59e0b",
  violet: "#7c3aed",
  cyan: "#06b6d4",
  slate: "#475569",
};

const ThemeContext = createContext<any>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("indigo");
  const [mode, setMode] = useState<Mode>("cool");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme;
    const savedMode = localStorage.getItem("mode") as Mode;

    if (savedTheme) setTheme(savedTheme);
    if (savedMode) setMode(savedMode);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    // remove all mode classes
    root.classList.remove(
      "dark",
      "dim",
      "oled",
      "midnight",
      "contrast",
      "soft",
      "neutral",
      "warm",
      "cool"
    );

    // apply mode
    if (mode !== "light") {
      root.classList.add(mode);
    }

    // apply theme color
    const color = colorMap[theme];

    root.style.setProperty("--primary", color);
    root.style.setProperty("--primary-soft", color + "20");

    localStorage.setItem("theme", theme);
    localStorage.setItem("mode", mode);
  }, [theme, mode]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);