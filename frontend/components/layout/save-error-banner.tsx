"use client";

import { AlertTriangle, X } from "lucide-react";
import { useTaskStore } from "@/lib/task-store";
import { useAuthStore } from "@/lib/auth-store";

// Surfaces backend connectivity/save failures that would otherwise be
// silently swallowed by task-store/auth-store's fetch calls — without this,
// edits (or an entire guest session) can "work" visually and then vanish on
// refresh with zero indication why.
export function SaveErrorBanner() {
  const { saveError, dismissSaveError } = useTaskStore();
  const { authError, dismissAuthError } = useAuthStore();
  const message = saveError ?? authError;
  if (!message) return null;

  const dismiss = () => {
    dismissSaveError();
    dismissAuthError();
  };

  return (
    <div
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] flex items-start gap-2 max-w-[92vw] sm:max-w-md rounded-xl border px-4 py-3 text-sm shadow-lg"
      style={{ background: "#fef2f2", borderColor: "#fecaca", color: "#991b1b" }}
      role="alert"
    >
      <AlertTriangle size={16} className="shrink-0 mt-0.5" />
      <span className="flex-1">{message}</span>
      <button onClick={dismiss} aria-label="Dismiss" className="shrink-0 opacity-70 hover:opacity-100">
        <X size={14} />
      </button>
    </div>
  );
}