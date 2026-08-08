"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useUIStore } from "@/lib/ui-store";
import { Sidebar } from "./sidebar";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { user } = useAuthStore();
  const router = useRouter();
  const { setMobileSidebarOpen } = useUIStore();

  useEffect(() => {
    if (!user) router.replace("/login");
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex flex-col md:flex-row">
      {/* Mobile top bar */}
      <div
        className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-0 z-30"
        style={{ background: "var(--sidebar-bg)", borderColor: "var(--border)" }}
      >
        <button onClick={() => setMobileSidebarOpen(true)} className="p-1">
          <Menu size={20} />
        </button>
        <span className="font-semibold text-sm">Pyramid</span>
      </div>

      <Sidebar />
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
