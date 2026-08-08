import { IsArray, IsIn, IsOptional, IsString } from "class-validator";

export class CreateTaskDto {
  @IsString()
  title: string;

  @IsIn(["todo", "doing", "completed", "on_hold"])
  status: string;

  @IsOptional()
  @IsIn(["no_priority", "low", "medium", "high", "urgent"])
  priority?: string;

  @IsOptional()
  @IsArray()
  memberIds?: string[];

  @IsOptional()
  @IsString()
  dueDate?: string;

  @IsOptional()
  @IsArray()
  labels?: string[];
}

export class UpdateTaskDto {
  @IsOptional() @IsString() title?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsIn(["todo", "doing", "completed", "on_hold"]) status?: string;
  @IsOptional() @IsIn(["no_priority", "low", "medium", "high", "urgent"]) priority?: string;
  @IsOptional() @IsArray() memberIds?: string[];
  @IsOptional() @IsString() dueDate?: string;
  @IsOptional() @IsArray() labels?: string[];
  @IsOptional() @IsArray() subtasks?: any[];
  @IsOptional() @IsArray() comments?: any[];
}
