import {ApiProperty} from '@nestjs/swagger';
import {IsString, IsOptional, IsInt, IsEnum, IsNumber} from 'class-validator';
import {TaskType} from './create-task.dto';

export class UpdateTaskDto {
  @ApiProperty({example: 'Новое название задачи', required: false})
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({example: 'Новое описание задачи', required: false})
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({example: 150, required: false})
  @IsOptional()
  @IsInt()
  reward?: number;

  @ApiProperty({example: 'https://example.com', required: false})
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({example: 1, required: false})
  @IsOptional()
  @IsNumber()
  imageId?: number;

  @ApiProperty({enum: TaskType, example: TaskType.SUBSCRIBE, required: false})
  @IsOptional()
  @IsEnum(TaskType)
  taskType?: TaskType;
}
