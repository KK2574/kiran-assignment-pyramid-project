"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Plus } from "lucide-react";
import { useTaskStore, MEMBERS, PRIORITY_LABEL } from "@/lib/task-store";
import { PriorityBadge, MemberAvatar } from "@/components/tasks/badges";
import { ActionMenu } from "@/components/ui/action-menu";
import type { Priority } from "@/lib/types";

const PRIORITIES: Priority[] = ["no_priority", "urgent", "high", "medium", "low"];

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const {
    projects,
    tasks,
    hydrated,
    fetchAll,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
    duplicateTask,
  } = useTaskStore();
  const [priorityOpen, setPriorityOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) fetchAll();
  }, [hydrated, fetchAll]);

  const project = projects.find((p) => p.id === id);
  const linkedTasks = tasks.filter((t) => t.projectId === id);

  if (!project) {
    return (
      <div className="p-6 text-sm" style={{ color: "var(--text-muted)" }}>
        {hydrated ? "Project not found." : "Loading…"}
      </div>
    );
  }

  const handleAddTask = () => {
    addTask("todo", "New Task");
    // Newly added task won't have projectId set yet — quick follow-up patch
    // targets the most recently created task in the store.
    setTimeout(() => {
      const latest = useTaskStore.getState().tasks.at(-1);
      if (latest) updateTask(latest.id, { projectId: project.id });
    }, 0);
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <button
        onClick={() => router.push("/projects")}
        className="flex items-center gap-1 text-sm mb-4"
        style={{ color: "var(--text-muted)" }}
      >
        <ArrowLeft size={14} /> Projects
      </button>

      <div className="flex items-start justify-between mb-6">
        <input
          defaultValue={project.name}
          onBlur={(e) => updateProject(project.id, { name: e.target.value || "Untitled" })}
          className="text-2xl font-semibold bg-transparent outline-none flex-1"
        />
        <ActionMenu
          actions={[
            {
              label: "Delete project",
              danger: true,
              onClick: () => {
                deleteProject(project.id);
                router.push("/projects");
              },
            },
          ]}
        />
      </div>

      <div className="flex flex-wrap items-center gap-6 text-sm mb-8">
        <div className="flex items-center gap-2">
          <span style={{ color: "var(--text-muted)" }}>Priority</span>
          <div className="relative">
            <button onClick={() => setPriorityOpen((v) => !v)}>
              <PriorityBadge priority={project.priority} />
            </button>
            {priorityOpen && (
              <div
                className="absolute left-0 top-6 z-20 w-36 rounded-xl border shadow-lg p-1"
                style={{ background: "var(--bg)", borderColor: "var(--border)" }}
              >
                {PRIORITIES.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      updateProject(project.id, { priority: p });
                      setPriorityOpen(false);
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-sm"
                  >
                    {PRIORITY_LABEL[p]}
                    {project.priority === p && "✓"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span style={{ color: "var(--text-muted)" }}>Lead</span>
          <MemberAvatar member={MEMBERS.find((m) => m.id === project.leadId)} />
        </div>

        <div className="flex items-center gap-2">
          <span style={{ color: "var(--text-muted)" }}>Due Date</span>
          <span>{project.dueDate ? new Date(project.dueDate).toLocaleDateString() : "Not set"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm font-medium">Tasks in this project</h2>
        <button
          onClick={handleAddTask}
          className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg border"
          style={{ borderColor: "var(--border)" }}
        >
          <Plus size={12} /> Add task
        </button>
      </div>

      <div className="rounded-xl border overflow-x-auto" style={{ borderColor: "var(--border)" }}>
        <div className="min-w-[560px]">
          <div
            className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] text-xs font-medium px-4 py-2"
            style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}
          >
            <span>Task</span><span>Priority</span><span>Members</span><span>Due Date</span><span></span>
          </div>
          {linkedTasks.length === 0 && (
            <div className="px-4 py-6 text-sm text-center" style={{ color: "var(--text-muted)" }}>
              No tasks linked to this project yet
            </div>
          )}
          {linkedTasks.map((task) => (
            <Link
              key={task.id}
              href={`/tasks/${task.id}`}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] items-center px-4 py-3 text-sm border-t hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
              style={{ borderColor: "var(--border)" }}
            >
              <span>{task.title}</span>
              <PriorityBadge priority={task.priority} />
              <div className="flex -space-x-1">
                {task.memberIds.length
                  ? task.memberIds.map((mid) => (
                      <MemberAvatar key={mid} member={MEMBERS.find((m) => m.id === mid)} />
                    ))
                  : <MemberAvatar />}
              </div>
              <span style={{ color: "var(--text-muted)" }}>
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
              </span>
              <ActionMenu
                actions={[
                  { label: "Duplicate", onClick: () => duplicateTask(task.id) },
                  { label: "Delete task", onClick: () => deleteTask(task.id), danger: true },
                ]}
              />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
