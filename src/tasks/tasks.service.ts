import {Injectable} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {Prisma} from '@prisma/client';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllTasks(filterDto?: GetTasksFilterDto) {
    const filters: Prisma.TaskWhereInput = {};
    if (filterDto) {
      if (filterDto.taskType) {
        filters.taskType = filterDto.taskType;
      }
      if (filterDto.status) {
        filters.status = filterDto.status;
      }
    }
    // Настройка пагинации:
    const page = filterDto?.page && filterDto.page > 0 ? filterDto.page : 1;
    const limit =
      filterDto?.limit && filterDto.limit > 0 ? filterDto.limit : 10;
    const skip = (page - 1) * limit;

    const tasks = await this.prismaService.task.findMany({
      where: filters,
      skip,
      take: limit,
    });
    const total = await this.prismaService.task.count({where: filters});

    return {
      data: tasks,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTaskById(taskId: number) {
    const task = await this.prismaService.task.findUnique({
      where: {id: taskId},
    });
    if (!task) throw new Error('Task not found');
    return task;
  }

  async createTask(data: CreateTaskDto) {
    return this.prismaService.task.create({
      data: {
        title: data.title,
        description: data.description,
        reward: data.reward,
        link: data.link,
        taskType: data.taskType ? data.taskType : 'click',
      },
    });
  }

  async updateTask(taskId: number, data: UpdateTaskDto) {
    await this.getTaskById(taskId);
    return this.prismaService.task.update({
      where: {id: taskId},
      data: {...data},
    });
  }

  async deleteTask(taskId: number) {
    await this.getTaskById(taskId);
    return this.prismaService.task.delete({where: {id: taskId}});
  }
}
