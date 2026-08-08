import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

export type Priority = "no_priority" | "low" | "medium" | "high" | "urgent";

@Entity()
export class Project {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column({ default: "no_priority" })
  priority: Priority;

  @Column({ nullable: true })
  leadId?: string;

  @Column({ nullable: true })
  dueDate?: string;
}
