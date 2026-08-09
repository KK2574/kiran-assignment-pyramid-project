import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { TasksService } from "../tasks/tasks.service";
import { ProjectsService } from "../projects/projects.service";

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    private readonly tasksService: TasksService,
    private readonly projectsService: ProjectsService,
  ) {}

  async onModuleInit() {
    const existing = await this.tasksService.findAll();
    if (existing.length > 0) {
      this.logger.log(`Database already has ${existing.length} task(s) — skipping auto-seed.`);
      return;
    }

    this.logger.log("Empty database detected — auto-seeding demo data...");

    await this.tasksService.create({ title: "Design Homepage", status: "todo", priority: "high", dueDate: "2026-09-12", labels: ["Design"] });
    await this.tasksService.create({ title: "Develop Login Feature", status: "todo", priority: "low", dueDate: "2026-09-15", labels: ["Development"] });
    await this.tasksService.create({ title: "Test Payment Gateway", status: "todo", priority: "medium", dueDate: "2026-09-18", labels: ["Testing"] });
    await this.tasksService.create({ title: "Write API Documentation", status: "doing", priority: "urgent", dueDate: "2026-07-31", labels: ["Research", "Design", "Development", "Testing", "Deployment"] });
    await this.tasksService.create({ title: "Code Review Completed", status: "doing", priority: "medium", dueDate: "2026-07-29", labels: ["Deployment"] });
    await this.tasksService.create({ title: "Feature Testing Passed", status: "completed", priority: "medium", dueDate: "2026-07-30", labels: ["Testing", "Passed"] });
    await this.tasksService.create({ title: "Security Audit Scheduled", status: "completed", priority: "high", dueDate: "2026-08-01", labels: ["Audit", "Scheduled"] });

    await this.projectsService.create({ name: "Design Homepage", priority: "high", dueDate: "2026-09-12" });
    await this.projectsService.create({ name: "Develop Login Feature", priority: "low", dueDate: "2026-09-15" });
    await this.projectsService.create({ name: "Test Payment Gateway", priority: "medium", dueDate: "2026-09-18" });

    this.logger.log("Auto-seed complete.");
  }
}