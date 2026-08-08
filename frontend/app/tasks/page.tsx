"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, LayoutGrid, ListIcon, Plus, ChevronDown } from "lucide-react";
import { useTaskStore, STATUS_LABEL, MEMBERS } from "@/lib/task-store";
import { PriorityBadge, MemberAvatar } from "@/components/tasks/badges";
import { ActionMenu } from "@/components/ui/action-menu";
import type { Status, Task } from "@/lib/types";

const STATUSES: Status[] = ["todo", "doing", "completed", "on_hold"];
type FieldKey = "priority" | "members" | "dueDate" | "labels" | "status" | "reporter";
const FIELD_OPTIONS: { key: FieldKey; label: string }[] = [
  { key: "priority", label: "Priority" },
  { key: "members", label: "Members" },
  { key: "dueDate", label: "Due Date" },
  { key: "labels", label: "Labels" },
  { key: "status", label: "Status" },
  { key: "reporter", label: "Reporter" },
];

export default function TasksPage() {
  const { tasks, hydrated, fetchAll, addTask, updateTask, duplicateTask, deleteTask } = useTaskStore();
  const [view, setView] = useState<"list" | "board">("list");
  const [search, setSearch] = useState("");
  const [fieldsOpen, setFieldsOpen] = useState(false);
  const [visibleFields, setVisibleFields] = useState<Set<FieldKey>>(
    new Set(["priority", "members", "dueDate"])
  );

  useEffect(() => {
    if (!hydrated) fetchAll();
  }, [hydrated, fetchAll]);

  const filtered = useMemo(
    () => tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase())),
    [tasks, search]
  );

  const toggleField = (key: FieldKey) => {
    setVisibleFields((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
        <h1 className="text-lg font-semibold">Tasks</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="pl-8 pr-3 py-1.5 text-sm rounded-lg border w-28 sm:w-40 bg-transparent"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          <div className="relative">
            <button
              onClick={() => setFieldsOpen((v) => !v)}
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
                  <label
                    key={f.key}
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer"
                  >
                    {f.label}
                    <input
                      type="checkbox"
                      checked={visibleFields.has(f.key)}
                      onChange={() => toggleField(f.key)}
                    />
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center rounded-lg border p-0.5" style={{ borderColor: "var(--border)" }}>
            <button
              onClick={() => setView("list")}
              className="p-1.5 rounded-md"
              style={{ background: view === "list" ? "var(--bg-subtle)" : "transparent" }}
            >
              <ListIcon size={14} />
            </button>
            <button
              onClick={() => setView("board")}
              className="p-1.5 rounded-md"
              style={{ background: view === "board" ? "var(--bg-subtle)" : "transparent" }}
            >
              <LayoutGrid size={14} />
            </button>
          </div>

          <button
            onClick={() => addTask("todo", "New Task")}
            className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg text-white"
            style={{ background: "var(--accent)" }}
          >
            <Plus size={14} /> Add Task
          </button>
        </div>
      </div>

      {view === "list" ? (
        <ListView
          tasks={filtered}
          fields={visibleFields}
          updateTask={updateTask}
          duplicateTask={duplicateTask}
          deleteTask={deleteTask}
        />
      ) : (
        <BoardView tasks={filtered} />
      )}
    </div>
  );
}

function ListView({
  tasks,
  fields,
  updateTask,
  duplicateTask,
  deleteTask,
}: {
  tasks: Task[];
  fields: Set<FieldKey>;
  updateTask: (id: string, patch: Partial<Task>) => void;
  duplicateTask: (id: string) => void;
  deleteTask: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-6">
      {STATUSES.map((status) => {
        const group = tasks.filter((t) => t.status === status);
        return (
          <div key={status}>
            <div className="flex items-center gap-2 mb-2">
              <ChevronDown size={14} />
              <span className="text-sm font-medium">{STATUS_LABEL[status]}</span>
              <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                {group.length}
              </span>
            </div>
            <div className="rounded-xl border overflow-x-auto" style={{ borderColor: "var(--border)" }}>
              <div className="min-w-[600px]">
              <div
                className="grid text-xs font-medium px-4 py-2"
                style={{
                  gridTemplateColumns: `2fr ${Array.from(fields).map(() => "1fr").join(" ")} 40px`,
                  background: "var(--bg-subtle)",
                  color: "var(--text-muted)",
                }}
              >
                <span>Task</span>
                {fields.has("priority") && <span>Priority</span>}
                {fields.has("members") && <span>Members</span>}
                {fields.has("dueDate") && <span>Due Date</span>}
                {fields.has("labels") && <span>Labels</span>}
                {fields.has("status") && <span>Status</span>}
                {fields.has("reporter") && <span>Reporter</span>}
                <span></span>
              </div>
              {group.length === 0 && (
                <div className="px-4 py-6 text-sm text-center" style={{ color: "var(--text-muted)" }}>
                  No tasks yet
                </div>
              )}
              {group.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  className="grid items-center px-4 py-3 text-sm border-t hover:bg-black/[0.02] dark:hover:bg-white/[0.03]"
                  style={{
                    gridTemplateColumns: `2fr ${Array.from(fields).map(() => "1fr").join(" ")} 40px`,
                    borderColor: "var(--border)",
                  }}
                >
                  <input
                    defaultValue={task.title}
                    onClick={(e) => e.preventDefault()}
                    onBlur={(e) => {
                      const v = e.target.value.trim();
                      if (v && v !== task.title) updateTask(task.id, { title: v });
                    }}
                    onKeyDown={(e) => e.key === "Enter" && (e.target as HTMLInputElement).blur()}
                    className="bg-transparent outline-none w-full"
                  />
                  {fields.has("priority") && <PriorityBadge priority={task.priority} />}
                  {fields.has("members") && (
                    <div className="flex -space-x-1">
                      {task.memberIds.length
                        ? task.memberIds.map((id) => (
                            <MemberAvatar key={id} member={MEMBERS.find((m) => m.id === id)} />
                          ))
                        : <MemberAvatar />}
                    </div>
                  )}
                  {fields.has("dueDate") && (
                    <span style={{ color: "var(--text-muted)" }}>
                      {task.dueDate ? formatDate(task.dueDate) : "—"}
                    </span>
                  )}
                  {fields.has("labels") && (
                    <span className="truncate" style={{ color: "var(--text-muted)" }}>
                      {task.labels.join(", ") || "—"}
                    </span>
                  )}
                  {fields.has("status") && <span>{STATUS_LABEL[task.status]}</span>}
                  {fields.has("reporter") && <span>—</span>}
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
      })}
    </div>
  );
}

function BoardView({ tasks }: { tasks: Task[] }) {
  const { addTask, moveTask, duplicateTask, deleteTask } = useTaskStore();
  return (
    <div className="grid grid-cols-[repeat(4,minmax(240px,1fr))] md:grid-cols-4 gap-4 overflow-x-auto pb-2">
      {STATUSES.map((status) => {
        const group = tasks.filter((t) => t.status === status);
        return (
          <div
            key={status}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              const id = e.dataTransfer.getData("text/task-id");
              if (id) moveTask(id, status);
            }}
          >
            <div className="flex items-center justify-between mb-2 px-1">
              <span className="text-sm font-medium">{STATUS_LABEL[status]}</span>
              <button onClick={() => addTask(status, "New Task")}>
                <Plus size={14} />
              </button>
            </div>
            <div className="flex flex-col gap-2">
              {group.map((task) => (
                <Link
                  key={task.id}
                  href={`/tasks/${task.id}`}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData("text/task-id", task.id)}
                  className="rounded-lg border p-3 text-sm hover:shadow-sm transition"
                  style={{ borderColor: "var(--border)" }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{task.title}</span>
                    <ActionMenu
                      actions={[
                        { label: "Duplicate", onClick: () => duplicateTask(task.id) },
                        { label: "Delete task", onClick: () => deleteTask(task.id), danger: true },
                      ]}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <MemberAvatar member={MEMBERS.find((m) => m.id === task.memberIds[0])} />
                    {task.dueDate && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded"
                        style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}
                      >
                        {formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                  {task.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.labels.slice(0, 2).map((l) => (
                        <span
                          key={l}
                          className="text-[10px] px-1.5 py-0.5 rounded border"
                          style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
                        >
                          {l}
                        </span>
                      ))}
                    </div>
                  )}
                </Link>
              ))}
              <button
                onClick={() => addTask(status, "New Task")}
                className="text-xs text-left px-3 py-2 rounded-lg border border-dashed"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                + Add Task
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}
