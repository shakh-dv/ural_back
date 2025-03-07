import {IsOptional, IsEnum} from 'class-validator';
import {Type} from 'class-transformer';
import {TaskType} from './create-task.dto';
// import {TaskStatus} from '@prisma/client';

export class GetTasksFilterDto {
  @IsOptional()
  @IsEnum(TaskType)
  taskType?: TaskType;

  // @IsOptional()
  // @IsEnum(TaskStatus)
  // status?: TaskStatus;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
