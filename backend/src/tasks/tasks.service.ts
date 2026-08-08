import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Task } from "./task.entity";
import { CreateTaskDto, UpdateTaskDto } from "./dto";

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly repo: Repository<Task>,
  ) {}

  findAll(): Promise<Task[]> {
    return this.repo.find();
  }

  async findOne(id: string): Promise<Task> {
    const task = await this.repo.findOneBy({ id });
    if (!task) throw new NotFoundException(`Task ${id} not found`);
    return task;
  }

  create(dto: CreateTaskDto): Promise<Task> {
    const task = this.repo.create({
      title: dto.title,
      status: dto.status as Task["status"],
      priority: (dto.priority as Task["priority"]) ?? "no_priority",
      memberIds: dto.memberIds ?? [],
      dueDate: dto.dueDate,
      labels: dto.labels ?? [],
      subtasks: [],
      comments: [],
    });
    return this.repo.save(task);
  }

  async update(id: string, dto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, dto);
    return this.repo.save(task);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}
