"use client";

import { create } from "zustand";
import type { Task, Project, Member, Status, Priority, Update } from "./types";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export const MEMBERS: Member[] = [
  { id: "m1", name: "Admin", avatarColor: "#7c3aed", initials: "A" },
  { id: "m2", name: "QA Team", avatarColor: "#0ea5e9", initials: "Q" },
  { id: "m3", name: "Designer", avatarColor: "#f43f5e", initials: "D" },
  { id: "m4", name: "Security", avatarColor: "#f59e0b", initials: "S" },
  { id: "m5", name: "CN", avatarColor: "#10b981", initials: "CN" },
];

const seedTasks = (): Task[] => [
  {
    id: "t1",
    title: "Design Homepage",
    description: "Create the landing page layout and hero section.",
    status: "todo",
    priority: "high",
    memberIds: ["m3"],
    dueDate: "2026-09-12",
    labels: ["Design"],
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "t2",
    title: "Develop Login Feature",
    status: "todo",
    priority: "low",
    memberIds: ["m5"],
    dueDate: "2026-09-15",
    labels: ["Development"],
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "t3",
    title: "Test Payment Gateway",
    status: "todo",
    priority: "medium",
    memberIds: [],
    dueDate: "2026-09-18",
    labels: ["Testing"],
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "t4",
    title: "Write API Documentation",
    description:
      "Create clear and detailed API documentation to guide developers in using the inventory and sales metrics features effectively.",
    status: "doing",
    priority: "urgent",
    memberIds: ["m3"],
    dueDate: "2026-07-31",
    labels: ["Research", "Design", "Development", "Testing", "Deployment"],
    subtasks: [
      { id: "s1", title: "Subtask 1", priority: "high", memberId: "m3", dueDate: "2026-09-12" },
      { id: "s2", title: "Subtask 2", priority: "low", memberId: "m5", dueDate: "2026-09-15" },
      { id: "s3", title: "Subtask 3", priority: "medium", dueDate: "2026-09-18" },
    ],
    comments: [{ id: "c1", authorId: "m1", text: "dsds", createdAt: new Date().toISOString() }],
    updates: [],
  },
  {
    id: "t5",
    title: "Code Review Completed",
    status: "doing",
    priority: "medium",
    memberIds: ["m1"],
    dueDate: "2026-07-29",
    labels: ["Deployment"],
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "t6",
    title: "Feature Testing Passed",
    status: "completed",
    priority: "medium",
    memberIds: ["m2"],
    dueDate: "2026-07-30",
    labels: ["Testing", "Passed"],
    subtasks: [],
    comments: [],
    updates: [],
  },
  {
    id: "t7",
    title: "Security Audit Scheduled",
    status: "completed",
    priority: "high",
    memberIds: ["m4"],
    dueDate: "2026-08-01",
    labels: ["Audit", "Scheduled"],
    subtasks: [],
    comments: [],
    updates: [],
  },
];

interface TaskState {
  tasks: Task[];
  projects: Project[];
  hydrated: boolean;
  apiConnected: boolean;
  saveError: string | null;
  fetchAll: () => Promise<void>;
  addTask: (status: Status, title: string, extra?: Partial<Task>) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  moveTask: (id: string, status: Status) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  addProject: (name: string) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  dismissSaveError: () => void;
}

// Wraps every write request so failures are surfaced instead of silently
// swallowed. Without this, a broken NEXT_PUBLIC_API_URL / CORS / down
// backend would make every edit "work" locally and then vanish on refresh,
// with zero indication anything was wrong.
//
// Also retries with real patience before giving up: free-tier hosts (e.g.
// Render) spin down when idle, and a write that lands right as the server
// is waking up would otherwise fail immediately on the very first try.
//
// Returns the parsed JSON response body on success (or null on failure), so
// callers that create a resource can reconcile a temporary client-side id
// with the real one the backend/database actually assigned.
async function persist(
  url: string,
  init: RequestInit,
  set: (patch: Partial<TaskState>) => void
): Promise<any | null> {
  const attempt = async (timeoutMs: number) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(url, { ...init, signal: controller.signal });
      if (!res.ok) throw new Error(`${init.method ?? "GET"} ${url} → ${res.status}`);
      return res;
    } finally {
      clearTimeout(timer);
    }
  };

  try {
    let res: Response;
    try {
      res = await attempt(8_000);
    } catch {
      res = await attempt(60_000); // likely a cold start — give it one patient retry
    }
    set({ apiConnected: true, saveError: null });
    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err) {
    console.error("Pyramid: failed to save to backend —", err);
    set({
      apiConnected: false,
      saveError:
        "Changes aren't being saved to the server (API unreachable). They'll be lost on refresh.",
    });
    return null;
  }
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  projects: [
    { id: "p1", name: "Design Homepage", priority: "high", leadId: "m3", dueDate: "2026-09-12" },
    { id: "p2", name: "Develop Login Feature", priority: "low", leadId: "m5", dueDate: "2026-09-15" },
    { id: "p3", name: "Test Payment Gateway", priority: "medium", dueDate: "2026-09-18" },
  ],
  hydrated: false,
  apiConnected: true,
  saveError: null,
  dismissSaveError: () => set({ saveError: null }),
  fetchAll: async () => {
    // Free-tier hosts (e.g. Render) spin down when idle and can take 30-60s
    // to wake on the first request. Retry with real patience before giving
    // up and falling back to local demo data, instead of failing on the
    // very first attempt while the server is still waking up.
    const attempt = async (timeoutMs: number) => {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), timeoutMs);
      try {
        const res = await fetch(`${API}/tasks`, { signal: controller.signal });
        clearTimeout(timer);
        if (!res.ok) throw new Error(`GET /tasks → ${res.status}`);
        return (await res.json()) as Task[];
      } catch (err) {
        clearTimeout(timer);
        throw err;
      }
    };

    try {
      let raw: Task[];
      try {
        raw = await attempt(8_000);
      } catch {
        // First attempt failed fast — likely a cold start. Give it one more,
        // much longer, try before we conclude the API is really unreachable.
        raw = await attempt(60_000);
      }
      // Defensive: guards against rows created before the `updates`/`resources`
      // columns existed on the backend (or any other backend/schema drift).
      const tasks = raw.map((t) => ({ ...t, updates: t.updates ?? [], resources: t.resources ?? [] }));
      set({ tasks, hydrated: true, apiConnected: true, saveError: null });
    } catch (err) {
      // API not running (e.g. static preview) — fall back to local seed data,
      // but make it loud: this app is NOT persisting anything right now.
      console.error("Pyramid: could not reach backend at", API, "— using local demo data only.", err);
      set({
        tasks: seedTasks(),
        hydrated: true,
        apiConnected: false,
        saveError: `Can't reach the API at ${API}. Showing local demo data — nothing you do will be saved.`,
      });
    }
  },
  addTask: (status, title, extra) => {
    const tempId = `t${Date.now()}`;
    const task: Task = {
      id: tempId,
      title,
      status,
      priority: "no_priority",
      memberIds: [],
      labels: [],
      subtasks: [],
      comments: [],
      updates: [],
      ...extra,
    };
    set({ tasks: [...get().tasks, task] });
    persist(
      `${API}/tasks`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(task) },
      set
    ).then((created) => {
      // The backend assigns its own real id (TypeORM's auto-generated UUID
      // ignores whatever id we sent) — swap our temp id for the real one so
      // later edits (PATCH/DELETE) target a row that actually exists.
      if (created?.id && created.id !== tempId) {
        set({
          tasks: get().tasks.map((t) => (t.id === tempId ? { ...t, ...created } : t)),
        });
      }
    });
  },
  updateTask: (id, patch) => {
    const current = get().tasks.find((t) => t.id === id);
    const newUpdates: Update[] = [];
    if (current) {
      if ("priority" in patch && patch.priority && patch.priority !== current.priority) {
        newUpdates.push({
          id: crypto.randomUUID(),
          authorId: "me",
          type: "priority_change",
          text: `changed priority from ${PRIORITY_LABEL[current.priority]} to ${PRIORITY_LABEL[patch.priority]}`,
          createdAt: new Date().toISOString(),
        });
      }
      if ("status" in patch && patch.status && patch.status !== current.status) {
        newUpdates.push({
          id: crypto.randomUUID(),
          authorId: "me",
          type: "status_change",
          text: `changed status from ${STATUS_LABEL[current.status]} to ${STATUS_LABEL[patch.status]}`,
          createdAt: new Date().toISOString(),
        });
      }
    }
    set({
      tasks: get().tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              ...patch,
              updates: newUpdates.length ? [...newUpdates, ...(t.updates ?? [])] : (t.updates ?? []),
            }
          : t
      ),
    });
    persist(
      `${API}/tasks/${id}`,
      { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) },
      set
    );
  },
  moveTask: (id, status) => get().updateTask(id, { status }),
  deleteTask: (id) => {
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
    persist(`${API}/tasks/${id}`, { method: "DELETE" }, set);
  },
  duplicateTask: (id) => {
    const original = get().tasks.find((t) => t.id === id);
    if (!original) return;
    const tempId = `t${Date.now()}`;
    const copy: Task = {
      ...original,
      id: tempId,
      title: `${original.title} (copy)`,
    };
    set({ tasks: [...get().tasks, copy] });
    persist(
      `${API}/tasks`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(copy) },
      set
    ).then((created) => {
      if (created?.id && created.id !== tempId) {
        set({
          tasks: get().tasks.map((t) => (t.id === tempId ? { ...t, ...created } : t)),
        });
      }
    });
  },
  addProject: (name) => {
    const tempId = `p${Date.now()}`;
    const project: Project = { id: tempId, name, priority: "no_priority" };
    set({ projects: [...get().projects, project] });
    persist(
      `${API}/projects`,
      { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(project) },
      set
    ).then((created) => {
      if (created?.id && created.id !== tempId) {
        set({
          projects: get().projects.map((p) => (p.id === tempId ? { ...p, ...created } : p)),
        });
      }
    });
  },
  updateProject: (id, patch) => {
    set({ projects: get().projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
    persist(
      `${API}/projects/${id}`,
      { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(patch) },
      set
    );
  },
  deleteProject: (id) => {
    set({ projects: get().projects.filter((p) => p.id !== id) });
    persist(`${API}/projects/${id}`, { method: "DELETE" }, set);
  },
}));

export const PRIORITY_LABEL: Record<Priority, string> = {
  no_priority: "No Priority",
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export const STATUS_LABEL: Record<Status, string> = {
  todo: "To Do",
  doing: "Doing",
  completed: "Completed",
  on_hold: "On Hold",
};