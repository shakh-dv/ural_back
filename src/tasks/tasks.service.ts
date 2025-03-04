import {Injectable} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {Prisma} from '@prisma/client';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {ConfigService} from '@nestjs/config';

@Injectable()
export class TasksService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService
  ) {}

  async getAllTasks(filterDto?: GetTasksFilterDto) {
    const filters: Prisma.TaskWhereInput = {};
    if (filterDto?.taskType) filters.taskType = filterDto.taskType;
    if (filterDto?.status) filters.status = filterDto.status;

    const page = filterDto?.page && filterDto.page > 0 ? filterDto.page : 1;
    const limit =
      filterDto?.limit && filterDto.limit > 0 ? filterDto.limit : 10;
    const skip = (page - 1) * limit;

    const tasks = await this.prismaService.task.findMany({
      where: filters,
      skip,
      take: limit,
      include: {image: true}, // Загружаем изображение
    });
    const total = await this.prismaService.task.count({where: filters});

    return {
      data: tasks.map(task => ({
        ...task,
        image: task.image
          ? {
              id: task.image.id,
              url: process.env.IMAGE_URL + task.image.filename,
              xsUrl: task.image.xsFilename
                ? process.env.IMAGE_URL + task.image.xsFilename
                : null,
              mdUrl: task.image.mdFilename
                ? process.env.IMAGE_URL + task.image.mdFilename
                : null,
            }
          : null,
      })),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getTaskById(taskId: number) {
    const task = await this.prismaService.task.findUnique({
      where: {id: taskId},
      include: {image: true}, // Загружаем изображение
    });
    if (!task) throw new Error('Task not found');

    return {
      ...task,
      image: task.image
        ? {
            id: task.image.id,
            filename: task.image.filename,
            url: process.env.IMAGE_URL + task.image.filename,
            xsFilename: task.image.xsFilename,
            xsUrl: task.image.xsFilename
              ? process.env.IMAGE_URL + task.image.xsFilename
              : null,
            mdFilename: task.image.mdFilename,
            mdUrl: task.image.mdFilename
              ? process.env.IMAGE_URL + task.image.mdFilename
              : null,
          }
        : null,
    };
  }

  async createTask(data: CreateTaskDto) {
    return this.prismaService.task.create({
      data: {
        title: data.title,
        description: data.description,
        reward: data.reward,
        link: data.link,
        imageId: data.imageId,
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
