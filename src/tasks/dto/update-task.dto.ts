import {IsString, IsOptional, IsInt, IsEnum} from 'class-validator';
import {TaskType} from './create-task.dto';

export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  reward?: number;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsEnum(TaskType)
  taskType?: TaskType;
}
