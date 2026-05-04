"use client";

import { useDrawer } from "@/app/components/ui/drawer";
import { useToast } from "@/app/components/ui/toast-provider";
import { useEffect, useState } from "react";

export default function OrganizationForm({
  organization,
  onSaved,
}: {
  organization?: any;
  onSaved: () => void;
}) {
  const { closeDrawer } = useDrawer();
  const { showToast } = useToast();
  const isEdit = !!organization;
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  /* ================= LOAD DATA ================= */
  useEffect(() => {
    if (isEdit && organization) {
      setName(organization.name || "");
    } else {
      setName("");
    }
  }, [isEdit, organization]);
  const isValid = name.trim().length > 0;
  /* ================= SUBMIT ================= */
  async function handleSubmit() {
    if (!isValid) {
      showToast("error", "Organization name is required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/organizations", {
        method: isEdit ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: organization?.id,
          name,
        }),
      });
      if (!res.ok) {
        throw new Error("Request failed");
      }
      showToast(
        "success",
        isEdit ? "Organization updated successfully" : "Organization created successfully"
      );
      onSaved();
      closeDrawer();
    } catch (error) {
      showToast("error", "Failed to save organization");
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="flex flex-col h-full">
      {/* BODY */}
      <div className="flex-1 space-y-5 overflow-y-auto pb-6">
        <h2 className="text-lg font-semibold">
          {isEdit ? "Edit Organization" : "Create Organization"}
        </h2>
        <div>
          <label className="text-sm opacity-70">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Organization name"
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
