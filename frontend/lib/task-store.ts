"use client";

import { create } from "zustand";
import type { Task, Project, Member, Status, Priority } from "./types";

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
  },
];

interface TaskState {
  tasks: Task[];
  projects: Project[];
  hydrated: boolean;
  fetchAll: () => Promise<void>;
  addTask: (status: Status, title: string) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  moveTask: (id: string, status: Status) => void;
  deleteTask: (id: string) => void;
  duplicateTask: (id: string) => void;
  addProject: (name: string) => void;
  updateProject: (id: string, patch: Partial<Project>) => void;
  deleteProject: (id: string) => void;
}

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: [],
  projects: [
    { id: "p1", name: "Design Homepage", priority: "high", leadId: "m3", dueDate: "2026-09-12" },
    { id: "p2", name: "Develop Login Feature", priority: "low", leadId: "m5", dueDate: "2026-09-15" },
    { id: "p3", name: "Test Payment Gateway", priority: "medium", dueDate: "2026-09-18" },
  ],
  hydrated: false,
  fetchAll: async () => {
    try {
      const res = await fetch(`${API}/tasks`);
      if (!res.ok) throw new Error("no api");
      const tasks = await res.json();
      set({ tasks, hydrated: true });
    } catch {
      // API not running (e.g. static preview) — fall back to local seed data
      set({ tasks: seedTasks(), hydrated: true });
    }
  },
  addTask: (status, title) => {
    const task: Task = {
      id: `t${Date.now()}`,
      title,
      status,
      priority: "no_priority",
      memberIds: [],
      labels: [],
      subtasks: [],
      comments: [],
    };
    set({ tasks: [...get().tasks, task] });
    fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    }).catch(() => {});
  },
  updateTask: (id, patch) => {
    set({ tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)) });
    fetch(`${API}/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => {});
  },
  moveTask: (id, status) => get().updateTask(id, { status }),
  deleteTask: (id) => {
    set({ tasks: get().tasks.filter((t) => t.id !== id) });
    fetch(`${API}/tasks/${id}`, { method: "DELETE" }).catch(() => {});
  },
  duplicateTask: (id) => {
    const original = get().tasks.find((t) => t.id === id);
    if (!original) return;
    const copy: Task = {
      ...original,
      id: `t${Date.now()}`,
      title: `${original.title} (copy)`,
    };
    set({ tasks: [...get().tasks, copy] });
    fetch(`${API}/tasks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(copy),
    }).catch(() => {});
  },
  addProject: (name) => {
    const project: Project = { id: `p${Date.now()}`, name, priority: "no_priority" };
    set({ projects: [...get().projects, project] });
    fetch(`${API}/projects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    }).catch(() => {});
  },
  updateProject: (id, patch) => {
    set({ projects: get().projects.map((p) => (p.id === id ? { ...p, ...patch } : p)) });
    fetch(`${API}/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    }).catch(() => {});
  },
  deleteProject: (id) => {
    set({ projects: get().projects.filter((p) => p.id !== id) });
    fetch(`${API}/projects/${id}`, { method: "DELETE" }).catch(() => {});
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
