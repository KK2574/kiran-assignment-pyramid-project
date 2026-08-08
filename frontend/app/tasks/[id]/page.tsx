"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Lock, Eye, Share2, ChevronDown, Send, X, Plus, Check } from "lucide-react";
import { useTaskStore, MEMBERS, PRIORITY_LABEL, STATUS_LABEL } from "@/lib/task-store";
import { MemberAvatar, PriorityBadge } from "@/components/tasks/badges";
import { ActionMenu } from "@/components/ui/action-menu";
import type { Priority } from "@/lib/types";

const PRIORITIES: Priority[] = ["no_priority", "urgent", "high", "medium", "low"];
const AVAILABLE_LABELS = ["Research", "Design", "Development", "Testing", "Deployment", "Bug", "Urgent"];

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { tasks, hydrated, fetchAll, updateTask, deleteTask, duplicateTask } = useTaskStore();
  const [priorityOpen, setPriorityOpen] = useState(false);
  const [labelsOpen, setLabelsOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!hydrated) fetchAll();
  }, [hydrated, fetchAll]);

  const task = tasks.find((t) => t.id === id);
  if (!task) return <div className="p-6 text-sm" style={{ color: "var(--text-muted)" }}>Loading…</div>;

  const submitComment = () => {
    if (!comment.trim()) return;
    updateTask(task.id, {
      comments: [
        ...task.comments,
        { id: crypto.randomUUID(), authorId: "me", text: comment, createdAt: new Date().toISOString() },
      ],
    });
    setComment("");
  };

  const toggleLabel = (label: string) => {
    const has = task.labels.includes(label);
    updateTask(task.id, {
      labels: has ? task.labels.filter((l) => l !== label) : [...task.labels, label],
    });
  };

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // clipboard API unavailable — no-op, UI still confirms visually
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="flex flex-col md:flex-row md:h-screen md:overflow-hidden">
      <div className="flex-1 md:overflow-y-auto p-4 md:p-8 max-w-3xl">
        <div className="flex items-center justify-end gap-2 mb-6">
          <Lock size={14} className="opacity-50" />
          <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
            <Eye size={14} /> 1
          </span>
          <div className="relative">
            <button onClick={handleShare} title="Copy link">
              <Share2 size={14} className="opacity-50 hover:opacity-100" />
            </button>
            {copied && (
              <span
                className="absolute right-0 top-6 text-xs px-2 py-1 rounded-md whitespace-nowrap border"
                style={{ background: "var(--bg)", borderColor: "var(--border)" }}
              >
                Link copied
              </span>
            )}
          </div>
          <ActionMenu
            actions={[
              { label: "Duplicate", onClick: () => duplicateTask(task.id) },
              {
                label: "Delete task",
                danger: true,
                onClick: () => {
                  deleteTask(task.id);
                  router.push("/tasks");
                },
              },
            ]}
          />
        </div>

        <input
          value={task.title}
          onChange={(e) => updateTask(task.id, { title: e.target.value })}
          className="text-2xl font-semibold w-full bg-transparent mb-2 outline-none"
        />
        <textarea
          value={task.description ?? ""}
          onChange={(e) => updateTask(task.id, { description: e.target.value })}
          placeholder="Add a description…"
          className="w-full text-sm bg-transparent outline-none resize-none mb-6"
          style={{ color: "var(--text-muted)" }}
          rows={2}
        />

        <div className="flex items-start gap-4 text-sm mb-4">
          <span className="pt-1" style={{ color: "var(--text-muted)" }}>Labels</span>
          <div className="flex flex-wrap items-center gap-1">
            {task.labels.map((l) => (
              <span
                key={l}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border"
                style={{ borderColor: "var(--border)" }}
              >
                {l}
                <button onClick={() => toggleLabel(l)} aria-label={`Remove ${l} label`}>
                  <X size={10} />
                </button>
              </span>
            ))}
            <div className="relative">
              <button
                onClick={() => setLabelsOpen((v) => !v)}
                className="flex items-center gap-1 text-xs px-2 py-0.5 rounded border border-dashed"
                style={{ borderColor: "var(--border)", color: "var(--text-muted)" }}
              >
                <Plus size={10} /> Add label
              </button>
              {labelsOpen && (
                <div
                  className="absolute left-0 top-7 z-30 w-44 rounded-xl border shadow-lg p-1 text-sm"
                  style={{ background: "var(--bg)", borderColor: "var(--border)" }}
                >
                  {AVAILABLE_LABELS.map((l) => (
                    <button
                      key={l}
                      onClick={() => toggleLabel(l)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      {l}
                      {task.labels.includes(l) && <Check size={12} />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {task.subtasks.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-1 text-sm font-medium mb-2">
              <ChevronDown size={14} /> Subtasks
            </div>
            <div className="rounded-xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
              <div
                className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] text-xs font-medium px-4 py-2"
                style={{ background: "var(--bg-subtle)", color: "var(--text-muted)" }}
              >
                <span>Task</span><span>Priority</span><span>Members</span><span>Due Date</span><span></span>
              </div>
              {task.subtasks.map((s) => (
                <div
                  key={s.id}
                  className="grid grid-cols-[2fr_1fr_1fr_1fr_40px] items-center px-4 py-3 text-sm border-t"
                  style={{ borderColor: "var(--border)" }}
                >
                  <span>{s.title}</span>
                  <PriorityBadge priority={s.priority} />
                  <MemberAvatar member={MEMBERS.find((m) => m.id === s.memberId)} />
                  <span style={{ color: "var(--text-muted)" }}>
                    {s.dueDate ? new Date(s.dueDate).toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                  </span>
                  <ActionMenu
                    actions={[
                      {
                        label: "Delete subtask",
                        danger: true,
                        onClick: () =>
                          updateTask(task.id, { subtasks: task.subtasks.filter((x) => x.id !== s.id) }),
                      },
                    ]}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="text-sm font-medium mb-3">Subtasks</p>
          {task.comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2 mb-3">
              <MemberAvatar member={MEMBERS.find((m) => m.id === c.authorId)} />
              <div>
                <p className="text-sm">
                  <span className="font-medium">{MEMBERS.find((m) => m.id === c.authorId)?.name ?? "You"}</span>{" "}
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </p>
                <p className="text-sm">{c.text}</p>
              </div>
            </div>
          ))}
          <div
            className="flex items-center gap-2 border rounded-lg px-3 py-2 mt-2"
            style={{ borderColor: "var(--border)" }}
          >
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submitComment()}
              placeholder="Add a comment…"
              className="flex-1 text-sm bg-transparent outline-none"
            />
            <button onClick={submitComment}>
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>

      <aside
        className="w-full md:w-[280px] shrink-0 border-t md:border-t-0 md:border-l p-5 md:overflow-y-auto"
        style={{ borderColor: "var(--border)" }}
      >
        <p className="text-sm font-medium mb-3 flex items-center gap-1">
          <ChevronDown size={14} /> Details
        </p>
        <div className="flex flex-col gap-3 text-sm">
          <Row label="Status">{STATUS_LABEL[task.status]}</Row>
          <Row label="Priority">
            <div className="relative">
              <button onClick={() => setPriorityOpen((v) => !v)}>
                <PriorityBadge priority={task.priority} />
              </button>
              {priorityOpen && (
                <div
                  className="absolute right-0 top-6 z-20 w-36 rounded-xl border shadow-lg p-1"
                  style={{ background: "var(--bg)" }}
                >
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => {
                        updateTask(task.id, { priority: p });
                        setPriorityOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-sm"
                    >
                      {PRIORITY_LABEL[p]}
                      {task.priority === p && "✓"}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Row>
          <Row label="Members">
            <div className="flex -space-x-1">
              {task.memberIds.map((id) => (
                <MemberAvatar key={id} member={MEMBERS.find((m) => m.id === id)} />
              ))}
              {task.memberIds.length === 0 && "Add members"}
            </div>
          </Row>
          <Row label="Dates">{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "Set date"}</Row>
          <Row label="Labels">{task.labels.length || "None"}</Row>
        </div>
      </aside>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: "var(--text-muted)" }}>{label}</span>
      <span>{children}</span>
    </div>
  );
}
