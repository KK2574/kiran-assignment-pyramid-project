import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TasksModule } from "./tasks/tasks.module";
import { ProjectsModule } from "./projects/projects.module";
import { AuthModule } from "./auth/auth.module";
import { Task } from "./tasks/task.entity";
import { Project } from "./projects/project.entity";
import { SeedService } from "./seed/seed.service";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: "sqlite",
      database: process.env.DB_PATH ?? "pyramid.sqlite",
      entities: [Task, Project],
      synchronize: true,
    }),
    TasksModule,
    ProjectsModule,
    AuthModule,
  ],
  providers: [SeedService],
})
export class AppModule {}