export type Priority = "no_priority" | "low" | "medium" | "high" | "urgent";
export type Status = "todo" | "doing" | "completed" | "on_hold";

export interface Member {
  id: string;
  name: string;
  avatarColor: string;
  initials: string;
}

export interface Subtask {
  id: string;
  title: string;
  priority: Priority;
  memberId?: string;
  dueDate?: string;
}

export interface Comment {
  id: string;
  authorId: string;
  text: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  priority: Priority;
  memberIds: string[];
  dueDate?: string;
  labels: string[];
  projectId?: string;
  subtasks: Subtask[];
  comments: Comment[];
}

export interface Project {
  id: string;
  name: string;
  priority: Priority;
  leadId?: string;
  dueDate?: string;
}
