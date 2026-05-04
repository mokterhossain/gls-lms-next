"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

type Toast = {
  id: string;
  type: ToastType;
  message: string;
};

type ToastContextType = {
  showToast: (type: ToastType, message: string) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID();

    setToasts((prev) => [...prev, { id, type, message }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  /* ================= THEME-BASED STYLE MAP ================= */
  const styles: Record<ToastType, string> = {
    success: "border-[var(--primary)]/30 text-[var(--primary)]",
    error: "border-red-500/30 text-red-500",
    warning: "border-yellow-500/30 text-yellow-500",
    info: "border-blue-500/30 text-blue-500",
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* TOAST CONTAINER */}
      <div className="fixed top-4 right-4 z-[9999] space-y-3 w-[320px]">

        {toasts.map((t, index) => (
          <div
            key={t.id}
            className={`
              relative overflow-hidden
              border rounded-xl px-4 py-3 shadow-lg backdrop-blur-md
              animate-in slide-in-from-right fade-in
              transition-all duration-300
              ${styles[t.type]}
            `}
            style={{
              background: "var(--surface)",
              transform: `translateY(${index * 6}px)`,
              borderColor: "var(--border)",
              color: "var(--text)",
            }}
          >
            {/* CLOSE */}
            <button
              onClick={() => removeToast(t.id)}
              className="absolute top-2 right-2 opacity-60 hover:opacity-100"
              style={{ color: "var(--text)" }}
            >
              <X size={14} />
            </button>

            {/* MESSAGE */}
            <p className="text-sm pr-5 leading-snug">
              {t.message}
            </p>

            {/* PROGRESS BAR */}
            <div
              className="absolute bottom-0 left-0 h-[3px] w-full"
              style={{ background: "rgba(0,0,0,0.08)" }}
            >
              <div
                className="h-full animate-toast-progress"
                style={{
                  background:
                    t.type === "success"
                      ? "var(--primary)"
                      : t.type === "error"
                      ? "#ef4444"
                      : t.type === "warning"
                      ? "#f59e0b"
                      : "#3b82f6",
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside ToastProvider");
  return ctx;
}