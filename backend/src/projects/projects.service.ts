import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Project } from "./project.entity";

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly repo: Repository<Project>,
  ) {}

  findAll(): Promise<Project[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Project> {
    const project = await this.repo.findOneBy({ id });
    if (!project) throw new NotFoundException(`Project ${id} not found`);
    return project;
  }

  create(data: Partial<Project>): Promise<Project> {
    const project = this.repo.create({
      name: data.name ?? "Untitled",
      priority: data.priority ?? "no_priority",
      leadId: data.leadId,
      dueDate: data.dueDate,
    });
    return this.repo.save(project);
  }

  async update(id: string, data: Partial<Project>): Promise<Project> {
    const project = await this.findOne(id);
    Object.assign(project, data);
    return this.repo.save(project);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
