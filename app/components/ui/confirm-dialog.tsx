"use client";

import { createContext, useContext, useState } from "react";
import { AlertTriangle } from "lucide-react";

type ConfirmOptions = {
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
};

type ConfirmContextType = {
  confirm: (options: ConfirmOptions) => void;
};

const ConfirmContext = createContext<ConfirmContextType | null>(null);

export function useConfirm() {
  const ctx = useContext(ConfirmContext);
  if (!ctx) throw new Error("useConfirm must be used inside provider");
  return ctx;
}

export function ConfirmProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [options, setOptions] = useState<ConfirmOptions | null>(null);

  const confirm = (opts: ConfirmOptions) => {
    setOptions(opts);
  };

  const close = () => setOptions(null);

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}

      {/* ================= DIALOG ================= */}
      {options && (
        <>
          {/* OVERLAY */}
          <div
            className="fixed inset-0 z-50 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm transition"
              onClick={close}
            />

            {/* MODAL */}
            <div
              className="relative z-50 w-full max-w-md mx-4 rounded-2xl shadow-2xl p-6
              transition-all duration-300 scale-100 opacity-100"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {/* ICON */}
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="p-2 rounded-full"
                  style={{ background: "rgba(239,68,68,0.1)" }}
                >
                  <AlertTriangle size={20} className="text-red-500" />
                </div>

                <h3 className="text-lg font-semibold">
                  {options.title || "Confirm action"}
                </h3>
              </div>

              {/* MESSAGE */}
              <p className="text-sm opacity-70 mb-6">
                {options.message || "Are you sure you want to continue?"}
              </p>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3">

                <button
                  onClick={close}
                  className="px-4 py-2 rounded-xl border text-sm"
                  style={{ borderColor: "var(--border)" }}
                >
                  {options.cancelText || "Cancel"}
                </button>

                <button
                  onClick={() => {
                    options.onConfirm();
                    close();
                  }}
                  className="px-4 py-2 rounded-xl text-sm text-white"
                  style={{
                    background: "#ef4444",
                  }}
                >
                  {options.confirmText || "Delete"}
                </button>

              </div>
            </div>
          </div>
        </>
      )}
    </ConfirmContext.Provider>
  );
}