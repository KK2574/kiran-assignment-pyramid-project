import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksModule } from "./tasks/tasks.module";
import { ProjectsModule } from "./projects/projects.module";
import { AuthModule } from "./auth/auth.module";
import { Task } from "./tasks/task.entity";
import { Project } from "./projects/project.entity";
import { SeedService } from "./seed/seed.service";

// Local dev: SQLite (zero setup, file lives at DB_PATH/pyramid.sqlite).
// Production: if DATABASE_URL is set (e.g. Render's managed Postgres), use
// that instead. This matters because Render's free *Web Service* disk is
// EPHEMERAL — it's wiped on every restart/redeploy/cold-start, which would
// silently reset a SQLite file and orphan every id the frontend was
// holding. A real managed Postgres instance doesn't have that problem.
const databaseConfig = process.env.DATABASE_URL
  ? {
      type: "postgres" as const,
      url: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required by Render's managed Postgres
      entities: [Task, Project],
      synchronize: true, // fine for an assessment/dev DB; use migrations in real prod
    }
  : {
      type: "sqlite" as const,
      database: process.env.DB_PATH ?? "pyramid.sqlite",
      entities: [Task, Project],
      synchronize: true,
    };

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TasksModule,
    ProjectsModule,
    AuthModule,
  ],
  providers: [SeedService],
})
export class AppModule {}