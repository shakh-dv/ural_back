import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {PrismaService} from '../core/infra/prisma/prisma.service';

@Injectable()
export class UserTasksService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUserTasks(userId: number) {
    return this.prismaService.userTask.findMany({
      where: {userId},
      include: {task: true},
    });
  }

  async startTask(userId: number, taskId: number) {
    // Проверяем, существует ли задача
    const task = await this.prismaService.task.findUnique({
      where: {id: taskId},
    });
    if (!task) {
      throw new NotFoundException('Task not found');
    }
    const existing = await this.prismaService.userTask.findUnique({
      where: {
        userId_taskId: {userId, taskId},
      },
    });
    if (existing) {
      throw new BadRequestException('Task already started or completed');
    }
    // Авто-завершение: создаём запись с status 'completed' и устанавливаем completedAt = now
    const now = new Date();
    const userTask = await this.prismaService.userTask.create({
      data: {
        userId,
        taskId,
        status: 'completed',
        completedAt: now,
      },
    });

    await this.prismaService.user.update({
      where: {id: userId},
      data: {balance: {increment: task.reward}},
    });

    return userTask;
  }
}
