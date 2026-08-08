"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, User, Sun, Palette } from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { useThemeStore, ACCENT_HEX, AccentColor } from "@/lib/theme-store";

const TABS = [
  { key: "profile", label: "Profile", icon: User },
  { key: "theme", label: "Theme", icon: Sun },
  { key: "color", label: "Color", icon: Palette },
] as const;

const ACCENTS: AccentColor[] = ["amber", "blue", "pink", "rose", "emerald", "black"];

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("profile");
  const { user, updateProfile, logout } = useAuthStore();
  const { mode, setMode, accent, setAccent } = useThemeStore();
  const router = useRouter();

  return (
    <div className="flex flex-col md:flex-row md:h-screen">
      <aside className="w-full md:w-64 shrink-0 border-b md:border-b-0 md:border-r p-4" style={{ borderColor: "var(--border)" }}>
        <Link href="/tasks" className="flex items-center gap-2 text-sm mb-4" style={{ color: "var(--text-muted)" }}>
          <ArrowLeft size={14} /> Back to app
        </Link>
        <div className="relative mb-4">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
          <input
            placeholder="Search"
            className="w-full pl-8 pr-3 py-1.5 text-sm rounded-lg border bg-transparent"
            style={{ borderColor: "var(--border)" }}
          />
        </div>
        <nav className="flex flex-col gap-0.5">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-md text-sm text-left"
              style={{ background: tab === t.key ? "var(--bg-subtle)" : "transparent" }}
            >
              <t.icon size={14} /> {t.label}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-8 max-w-xl">
        {tab === "profile" && (
          <>
            <h1 className="text-lg font-semibold mb-4">Profile</h1>
            <div className="rounded-xl border divide-y" style={{ borderColor: "var(--border)" }}>
              <FieldRow label="Profile picture">
                <div
                  className="w-8 h-8 rounded-full"
                  style={{ background: ACCENT_HEX[accent] }}
                />
              </FieldRow>
              <FieldRow label="Email">
                <span style={{ color: "var(--text-muted)" }}>{user?.email}</span>
              </FieldRow>
              <FieldRow label="Full name">
                <input
                  defaultValue={user?.name}
                  onBlur={(e) => updateProfile({ name: e.target.value })}
                  className="text-right bg-transparent outline-none text-sm w-40"
                />
              </FieldRow>
              <FieldRow label="Title" sub="Your job title or role">
                <input
                  defaultValue={user?.title}
                  placeholder="Designer"
                  onBlur={(e) => updateProfile({ title: e.target.value })}
                  className="text-right bg-transparent outline-none text-sm w-40"
                  style={{ color: "var(--text-muted)" }}
                />
              </FieldRow>
              <FieldRow label="Username" sub="One word, like a nickname or first name">
                <input
                  defaultValue={user?.username}
                  placeholder="username"
                  onBlur={(e) => updateProfile({ username: e.target.value })}
                  className="text-right bg-transparent outline-none text-sm w-40"
                  style={{ color: "var(--text-muted)" }}
                />
              </FieldRow>
            </div>

            <h2 className="text-lg font-semibold mt-8 mb-4">Workspace access</h2>
            <div
              className="rounded-xl border flex items-center justify-between px-4 py-4"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-sm" style={{ color: "var(--text-muted)" }}>
                Remove yourself from the workspace
              </span>
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-sm text-red-500 px-3 py-1.5 rounded-full border border-red-200"
              >
                Leave Workspace
              </button>
            </div>
          </>
        )}

        {tab === "theme" && (
          <>
            <h1 className="text-lg font-semibold mb-4">Theme</h1>
            <div className="flex gap-3">
              {(["light", "dark"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  className="flex-1 rounded-xl border p-4 text-sm capitalize"
                  style={{ borderColor: mode === m ? "var(--accent)" : "var(--border)" }}
                >
                  {m}
                </button>
              ))}
            </div>
          </>
        )}

        {tab === "color" && (
          <>
            <h1 className="text-lg font-semibold mb-4">Color</h1>
            <div className="grid grid-cols-3 gap-3">
              {ACCENTS.map((a) => (
                <button
                  key={a}
                  onClick={() => setAccent(a)}
                  className="rounded-xl border p-4 flex flex-col items-center gap-2 text-sm capitalize"
                  style={{ borderColor: accent === a ? ACCENT_HEX[a] : "var(--border)" }}
                >
                  <span className="w-6 h-6 rounded-full" style={{ background: ACCENT_HEX[a] }} />
                  {a}
                </button>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function FieldRow({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-3">
      <div>
        <p className="text-sm">{label}</p>
        {sub && <p className="text-xs" style={{ color: "var(--text-muted)" }}>{sub}</p>}
      </div>
      {children}
    </div>
  );
}
