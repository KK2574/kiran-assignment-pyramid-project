import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type Priority = "no_priority" | "low" | "medium" | "high" | "urgent";
export type Status = "todo" | "doing" | "completed" | "on_hold";

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

export interface Update {
  id: string;
  authorId: string;
  type: "priority_change" | "status_change" | "generic";
  text: string;
  createdAt: string;
}

export interface Resource {
  id: string;
  title: string;
  url: string;
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: "todo" })
  status!: Status;

  @Column({ default: "no_priority" })
  priority!: Priority;

  // SQLite has no native array/json column type in older drivers, so we
  // store these as JSON text and (de)serialize via TypeORM's transformer.
  @Column({ type: "simple-json", default: "[]" })
  memberIds!: string[];

  @Column({ nullable: true })
  dueDate?: string;

  @Column({ type: "simple-json", default: "[]" })
  labels!: string[];

  @Column({ nullable: true })
  projectId?: string;

  @Column({ type: "simple-json", default: "[]" })
  subtasks!: Subtask[];

  @Column({ type: "simple-json", default: "[]" })
  comments!: Comment[];

  @Column({ type: "simple-json", default: "[]" })
  updates!: Update[];

  @Column({ type: "simple-json", default: "[]" })
  resources!: Resource[];
}