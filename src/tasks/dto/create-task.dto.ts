import {IsString, IsNotEmpty, IsInt, IsOptional, IsEnum} from 'class-validator';
import {ApiProperty} from '@nestjs/swagger';

export enum TaskType {
  CLICK = 'click',
  SUBSCRIBE = 'subscribe',
  EXTERNAL = 'external',
}

export class CreateTaskDto {
  @ApiProperty({example: 'Название задачи'})
  @IsString()
  @IsNotEmpty()
  title!: string;

  @ApiProperty({example: 'Описание задачи'})
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({example: 100})
  @IsInt()
  reward!: number;

  @ApiProperty({example: 'https://example.com', required: false})
  @IsOptional()
  @IsString()
  link?: string;

  @ApiProperty({enum: TaskType, example: TaskType.CLICK, required: false})
  @IsOptional()
  @IsEnum(TaskType)
  taskType?: TaskType;
}
