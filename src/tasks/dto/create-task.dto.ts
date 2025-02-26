import {IsString, IsNotEmpty, IsInt, IsOptional, IsEnum} from 'class-validator';

export enum TaskType {
  CLICK = 'click',
  SUBSCRIBE = 'subscribe',
  EXTERNAL = 'external',
}

export class CreateTaskDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsInt()
  reward!: number;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  @IsEnum(TaskType)
  taskType?: TaskType;
}
