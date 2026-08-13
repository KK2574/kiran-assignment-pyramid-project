"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, LayoutGrid, Plus, ChevronRight } from "lucide-react";
import { useTaskStore, MEMBERS, PRIORITY_LABEL } from "@/lib/task-store";
import { PriorityBadge, MemberAvatar } from "@/components/tasks/badges";
import { ActionMenu } from "@/components/ui/action-menu";
import type { Priority } from "@/lib/types";

type FieldKey = "priority" | "lead" | "dueDate" | "teams" | "labels" | "status" | "reporter";
const FIELD_OPTIONS: { key: FieldKey; label: string }[] = [
  { key: "status", label: "Status" },
  { key: "priority", label: "Priority" },
  { key: "lead", label: "Members" },
  { key: "dueDate", label: "Due Date" },
  { key: "teams", label: "Teams" },
  { key: "labels", label: "Labels" },
  { key: "reporter", label: "Reporter" },
];
const PRIORITY_ORDER: Priority[] = ["no_priority", "urgent", "high", "medium", "low"];

export default function ProjectsPage() {
  const { projects, addProject, deleteProject, updateProject } = useTaskStore();
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [fieldSubOpen, setFieldSubOpen] = useState<FieldKey | null>(null);
  const [visibleFields, setVisibleFields] = useState<Set<FieldKey>>(
    new Set(["priority", "lead", "dueDate"])
  );
  const [priorityMenuFor, setPriorityMenuFor] = useState<string | null>(null);

  const toggleField = (key: FieldKey) => {
    setVisibleFields((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-lg font-semibold">Projects</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="p-1.5 rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <Search size={14} />
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setFieldsOpen((v) => !v);
                setFieldSubOpen(null);
              }}
              className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border"
              style={{ borderColor: "var(--border)" }}
            >
              <LayoutGrid size={14} /> Fields
            </button>
            {fieldsOpen && (
              <div
                className="absolute right-0 top-9 z-20 w-48 rounded-xl border shadow-lg p-1 text-sm"
                style={{ background: "var(--bg)" }}
              >
                {FIELD_OPTIONS.map((f) => (
                  <div key={f.key} className="relative">
                    <button
                      onMouseEnter={() => setFieldSubOpen(f.key)}
                      onClick={() => toggleField(f.key)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <span className="flex items-center gap-2">
                        {visibleFields.has(f.key) && (
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--accent)" }} />
                        )}
                        {f.label}
                      </span>
                      <ChevronRight size={14} className="opacity-50" />
                    </button>
                    {f.key === "priority" && fieldSubOpen === "priority" && (
                      <div
                        className="absolute right-full top-0 mr-1 w-40 rounded-xl border shadow-lg p-1"
                        onMouseLeave={() => setFieldSubOpen(null)}
                        style={{ background: "var(--bg)" }}
                      >
                        <div className="px-3 py-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          Priority
                        </div>
                        {PRIORITY_ORDER.map((p) => (
                          <div
                            key={p}
                            className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-sm"
                          >
                            <span className="flex items-center gap-2">
                              <PriorityBadge priority={p} />
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => addProject("New Project")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg text-white"
            style={{ background: "var(--accent)" }}
          >
            <Plus size={14} /> Add Project
          </button>
        </div>
      </div>

      <div className="rounded-xl border overflow-x-auto" style={{ borderColor: "var(--border)" }}>
        <div className="min-w-[560px]">
          <div
            className="grid text-xs font-medium px-4 py-2"
            style={{
              gridTemplateColumns: `2fr ${Array.from(visibleFields).map(() => "1fr").join(" ")} 40px`,
              background: "var(--bg-subtle)",
              color: "var(--text-muted)",
            }}
          >
            <span>Projects</span>
            {visibleFields.has("status") && <span>Status</span>}
            {visibleFields.has("priority") && <span>Priority</span>}
            {visibleFields.has("lead") && <span>Members</span>}
            {visibleFields.has("dueDate") && <span>Due Date</span>}
            {visibleFields.has("teams") && <span>Teams</span>}
            {visibleFields.has("labels") && <span>Labels</span>}
            {visibleFields.has("reporter") && <span>Reporter</span>}
            <span></span>
          </div>
          {projects.map((p) => (
            <div
              key={p.id}
              className="grid items-center px-4 py-3 text-sm border-t hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              style={{
                gridTemplateColumns: `2fr ${Array.from(visibleFields).map(() => "1fr").join(" ")} 40px`,
                borderColor: "var(--border)",
              }}
            >
              <Link href={`/projects/${p.id}`} className="text-blue-500 hover:underline w-fit">
                {p.name}
              </Link>
              {visibleFields.has("status") && <span style={{ color: "var(--text-muted)" }}>—</span>}
              {visibleFields.has("priority") && (
                <div className="relative w-fit">
                  <button onClick={() => setPriorityMenuFor(priorityMenuFor === p.id ? null : p.id)}>
                    <PriorityBadge priority={p.priority} />
                  </button>
                  {priorityMenuFor === p.id && (
                    <div
                      className="absolute left-0 top-6 z-20 w-40 rounded-xl border shadow-lg p-1 text-sm"
                      onMouseLeave={() => setPriorityMenuFor(null)}
                      style={{ background: "var(--bg)" }}
                    >
                      <div className="px-3 py-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                        Priority
                      </div>
                      {PRIORITY_ORDER.map((pr) => (
                        <button
                          key={pr}
                          onClick={() => {
                            updateProject(p.id, { priority: pr });
                            setPriorityMenuFor(null);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                        >
                          <PriorityBadge priority={pr} />
                          {p.priority === pr && "✓"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
              {visibleFields.has("lead") && <MemberAvatar member={MEMBERS.find((m) => m.id === p.leadId)} />}
              {visibleFields.has("dueDate") && (
                <span style={{ color: "var(--text-muted)" }}>
                  {p.dueDate ? new Date(p.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                </span>
              )}
              {visibleFields.has("teams") && <span style={{ color: "var(--text-muted)" }}>—</span>}
              {visibleFields.has("labels") && <span style={{ color: "var(--text-muted)" }}>—</span>}
              {visibleFields.has("reporter") && <span style={{ color: "var(--text-muted)" }}>—</span>}
              <ActionMenu actions={[{ label: "Delete project", danger: true, onClick: () => deleteProject(p.id) }]} />
            </div>
          ))}
          {projects.length === 0 && (
            <div className="px-4 py-6 text-sm text-center" style={{ color: "var(--text-muted)" }}>
              No projects yet
            </div>
          )}
          <button
            onClick={() => addProject("New Project")}
            className="w-full text-left px-4 py-3 text-sm hover:bg-black/5 dark:hover:bg-white/5"
            style={{ color: "var(--text-muted)" }}
          >
            + Add Projects
          </button>
        </div>
      </div>
    </div>
  );
}