"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { ChevronsUpDown, Sun, Moon, Settings, X } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useThemeStore, ACCENT_HEX, AccentColor } from "@/lib/theme-store";
import { useUIStore } from "@/lib/ui-store";
import { CheckSquare, FolderKanban } from "lucide-react";

const NAV = [
  { href: "/tasks", label: "Tasks", icon: CheckSquare },
  { href: "/projects", label: "Projects", icon: FolderKanban },
];

const ACCENTS: { key: AccentColor; label: string }[] = [
  { key: "amber", label: "Amber" },
  { key: "blue", label: "Blue" },
  { key: "pink", label: "Pink" },
  { key: "rose", label: "Rose" },
  { key: "emerald", label: "Emerald" },
  { key: "black", label: "Black" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { mode, accent, setMode, setAccent } = useThemeStore();
  const { mobileSidebarOpen, setMobileSidebarOpen } = useUIStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeSubOpen, setThemeSubOpen] = useState<null | "theme" | "color">(null);

  return (
    <>
      {/* Mobile backdrop */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      <aside
        className={`w-[220px] md:w-[200px] shrink-0 border-r flex flex-col h-screen p-3 fixed md:sticky top-0 z-50 transition-transform duration-200 ${
          mobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
        style={{ background: "var(--sidebar-bg)" }}
      >
        <button
          onClick={() => setMobileSidebarOpen(false)}
          className="md:hidden self-end p-1 mb-2 rounded hover:bg-black/5 dark:hover:bg-white/5"
        >
          <X size={16} />
        </button>
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="w-full flex items-center gap-2 px-2 py-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 text-left"
        >
          <div
            className="w-7 h-7 rounded-full shrink-0"
            style={{ background: accent === "black" ? "#171717" : ACCENT_HEX[accent] }}
          />
          <span className="font-medium text-sm flex-1 truncate">{user?.name ?? "Guest"}</span>
          <ChevronsUpDown size={14} className="opacity-50" />
        </button>

        {menuOpen && (
          <div
            className="absolute left-0 top-11 z-20 w-56 rounded-xl border shadow-lg p-1 text-sm"
            style={{ background: "var(--bg)" }}
          >
            <div className="px-3 py-2">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {user?.email}
              </p>
            </div>
            <div className="h-px my-1" style={{ background: "var(--border)" }} />

            <div className="relative">
              <button
                onMouseEnter={() => setThemeSubOpen("theme")}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <Sun size={14} /> Change Theme
                </span>
                <span>›</span>
              </button>
              {themeSubOpen === "theme" && (
                <div
                  className="absolute left-full top-0 ml-1 w-36 rounded-xl border shadow-lg p-1"
                  onMouseLeave={() => setThemeSubOpen(null)}
                  style={{ background: "var(--bg)" }}
                >
                  <button
                    onClick={() => setMode("light")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2"><Sun size={14} /> Light</span>
                    {mode === "light" && "✓"}
                  </button>
                  <button
                    onClick={() => setMode("dark")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <span className="flex items-center gap-2"><Moon size={14} /> Dark</span>
                    {mode === "dark" && "✓"}
                  </button>
                </div>
              )}
            </div>

            <div className="relative">
              <button
                onMouseEnter={() => setThemeSubOpen("color")}
                className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
              >
                <span className="flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full inline-block"
                    style={{ background: ACCENT_HEX[accent] }}
                  />
                  Color Mode
                </span>
                <span>›</span>
              </button>
              {themeSubOpen === "color" && (
                <div
                  className="absolute left-full top-0 ml-1 w-40 rounded-xl border shadow-lg p-1"
                  onMouseLeave={() => setThemeSubOpen(null)}
                  style={{ background: "var(--bg)" }}
                >
                  {ACCENTS.map((a) => (
                    <button
                      key={a.key}
                      onClick={() => setAccent(a.key)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span className="flex items-center gap-2">
                        <span
                          className="w-3.5 h-3.5 rounded-full inline-block"
                          style={{ background: ACCENT_HEX[a.key] }}
                        />
                        {a.label}
                      </span>
                      {accent === a.key && "✓"}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/settings"
              className="w-full flex items-center gap-2 px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Settings size={14} /> Settings
            </Link>

            <div className="h-px my-1" style={{ background: "var(--border)" }} />
            <button
              onClick={() => {
                logout();
                router.push("/login");
              }}
              className="w-full text-left px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-red-500"
            >
              Log out
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 mb-2 px-2 text-xs font-medium" style={{ color: "var(--text-muted)" }}>
        Workspace
      </div>

      <nav className="flex flex-col gap-0.5">
        {NAV.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm"
              style={{
                background: active ? "var(--bg-subtle)" : "transparent",
                fontWeight: active ? 600 : 400,
              }}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>
      </aside>
    </>
  );
}
