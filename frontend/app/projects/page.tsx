"use client";

import Link from "next/link";
import { Search, LayoutGrid, Plus } from "lucide-react";
import { useTaskStore, MEMBERS } from "@/lib/task-store";
import { PriorityBadge, MemberAvatar } from "@/components/tasks/badges";
import { ActionMenu } from "@/components/ui/action-menu";

export default function ProjectsPage() {
  const { projects, addProject, deleteProject } = useTaskStore();

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-lg font-semibold">Projects</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button className="p-1.5 rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <Search size={14} />
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border" style={{ borderColor: "var(--border)" }}>
            <LayoutGrid size={14} /> Fields
          </button>
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
            className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] text-xs font-medium px-4 py-2"
            style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}
          >
            <span>Projects</span><span>Priority</span><span>Lead</span><span>Due Date</span><span></span>
          </div>
          {projects.map((p) => (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] items-center px-4 py-3 text-sm border-t hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              style={{ borderColor: "var(--border)" }}
            >
              <span className="text-blue-500 hover:underline w-fit">{p.name}</span>
              <PriorityBadge priority={p.priority} />
              <MemberAvatar member={MEMBERS.find((m) => m.id === p.leadId)} />
              <span style={{ color: "var(--text-muted)" }}>
                {p.dueDate ? new Date(p.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
              </span>
              <ActionMenu actions={[{ label: "Delete project", danger: true, onClick: () => deleteProject(p.id) }]} />
            </Link>
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
