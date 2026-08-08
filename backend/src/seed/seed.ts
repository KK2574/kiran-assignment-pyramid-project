// One-off script to populate the SQLite DB with demo data matching the
// original Figma mock. Run with: npm run seed
import { NestFactory } from "@nestjs/core";
import { AppModule } from "../app.module";
import { TasksService } from "../tasks/tasks.service";
import { ProjectsService } from "../projects/projects.service";

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const tasksService = app.get(TasksService);
  const projectsService = app.get(ProjectsService);

  const existing = await tasksService.findAll();
  if (existing.length > 0) {
    console.log("Database already has tasks — skipping seed.");
    await app.close();
    return;
  }

  await tasksService.create({ title: "Design Homepage", status: "todo", priority: "high", dueDate: "2026-09-12", labels: ["Design"] });
  await tasksService.create({ title: "Develop Login Feature", status: "todo", priority: "low", dueDate: "2026-09-15", labels: ["Development"] });
  await tasksService.create({ title: "Test Payment Gateway", status: "todo", priority: "medium", dueDate: "2026-09-18", labels: ["Testing"] });
  await tasksService.create({ title: "Write API Documentation", status: "doing", priority: "urgent", dueDate: "2026-07-31", labels: ["Research", "Design", "Development", "Testing", "Deployment"] });
  await tasksService.create({ title: "Code Review Completed", status: "doing", priority: "medium", dueDate: "2026-07-29", labels: ["Deployment"] });
  await tasksService.create({ title: "Feature Testing Passed", status: "completed", priority: "medium", dueDate: "2026-07-30", labels: ["Testing", "Passed"] });
  await tasksService.create({ title: "Security Audit Scheduled", status: "completed", priority: "high", dueDate: "2026-08-01", labels: ["Audit", "Scheduled"] });

  await projectsService.create({ name: "Design Homepage", priority: "high", dueDate: "2026-09-12" });
  await projectsService.create({ name: "Develop Login Feature", priority: "low", dueDate: "2026-09-15" });
  await projectsService.create({ name: "Test Payment Gateway", priority: "medium", dueDate: "2026-09-18" });

  console.log("Seed complete.");
  await app.close();
}

seed();
