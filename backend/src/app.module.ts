import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksModule } from "./tasks/tasks.module";
import { ProjectsModule } from "./projects/projects.module";
import { AuthModule } from "./auth/auth.module";
import { Task } from "./tasks/task.entity";
import { Project } from "./projects/project.entity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: process.env.DB_PATH ?? "pyramid.sqlite",
      entities: [Task, Project],
      synchronize: true, // fine for an assessment/dev DB; use migrations in real prod
    }),
    TasksModule,
    ProjectsModule,
    AuthModule,
  ],
})
export class AppModule {}
