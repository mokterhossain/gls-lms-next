"use client";

import { useDrawer } from "@/app/components/ui/drawer";
import { useEffect, useState } from "react";
import { useToast } from "@/app/components/ui/toast-provider";

export default function ModuleForm({
  module,
  onSaved,
}: {
  module?: any;
  onSaved: () => void;
}) {
  const { closeDrawer } = useDrawer();
  const { showToast } = useToast();

  const isEdit = !!module;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (isEdit && module) {
      setName(module.name || "");
      setDescription(module.description || "");
    } else {
      setName("");
      setDescription("");
    }
  }, [isEdit, module]);

  const isValid = name.trim().length > 0;

  /* ================= SUBMIT ================= */
  async function handleSubmit() {
    if (!isValid) {
      showToast("error", "Module name is required");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/modules", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: module?.id,
          name,
          description,
        }),
      });

      if (!res.ok) {
        throw new Error("Request failed");
      }

      showToast(
        "success",
        isEdit ? "Module updated successfully" : "Module created successfully"
      );

      onSaved();
      closeDrawer();

    } catch (err) {
      console.error(err);
      showToast("error", "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col h-full">

      {/* BODY */}
      <div className="flex-1 space-y-5 overflow-y-auto pb-6">

        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Module" : "Create Module"}
        </h2>

        {/* NAME */}
        <div>
          <label className="text-sm opacity-70">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Module name"
            className="w-full mt-1 px-3 py-2 rounded-xl border outline-none"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          />

          {!isValid && (
            <p className="text-xs text-red-500 mt-1">
              Name is required
            </p>
          )}
        </div>

        {/* DESCRIPTION */}
        <div>
          <label className="text-sm opacity-70">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Optional description..."
            className="w-full mt-1 px-3 py-2 rounded-xl border outline-none min-h-[120px]"
            style={{
              background: "var(--surface)",
              borderColor: "var(--border)",
            }}
          />
        </div>

      </div>

      {/* FOOTER */}
      <div
        className="border-t flex justify-end gap-3 px-5 py-4"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >

        <button
          onClick={closeDrawer}
          className="px-4 py-2 rounded-xl border text-sm hover:opacity-80 transition"
          style={{ borderColor: "var(--border)" }}
        >
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading || !isValid}
          className="px-4 py-2 rounded-xl text-sm text-white transition"
          style={{
            background: "var(--primary)",
            opacity: loading || !isValid ? 0.6 : 1,
          }}
        >
          {loading ? "Saving..." : "Save"}
        </button>

      </div>
    </div>
  );
}