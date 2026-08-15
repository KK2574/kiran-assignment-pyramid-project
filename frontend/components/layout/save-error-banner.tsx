"use client";

import { AlertTriangle, X } from "lucide-react";
import { useTaskStore } from "@/lib/task-store";

// Surfaces backend connectivity/save failures that would otherwise be
// silently swallowed by task-store's fetch calls — without this, edits can
// "work" visually and then vanish on refresh with zero indication why.
export function SaveErrorBanner() {
  const { saveError, dismissSaveError } = useTaskStore();
  if (!saveError) return null;

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-start gap-2 max-w-[92vw] sm:max-w-md rounded-xl border px-4 py-3 text-sm shadow-lg"
      style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" }}
      role="alert"
    >
      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
      <span className="flex-1">{saveError}</span>
      <button onClick={dismissSaveError} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}