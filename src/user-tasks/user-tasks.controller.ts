import {Controller, Get, Post, Param, Query, ParseIntPipe} from '@nestjs/common';
import {UserTasksService} from './user-tasks.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

@ApiTags('UserTasks')
@Controller('user-tasks')
export class UserTasksController {
  constructor(private readonly userTasksService: UserTasksService) {}

  @Get()
  @ApiOperation({summary: 'Получить список задач пользователя'})
  @ApiQuery({name: 'userId', type: Number, description: 'ID пользователя'})
  async getUserTasks(@Query('userId', ParseIntPipe) userId: number) {
    return this.userTasksService.getUserTasks(userId);
  }

  @Post(':taskId/start')
  @ApiOperation({summary: 'Начать задачу (авто-завершение)'})
  @ApiParam({name: 'taskId', type: Number, description: 'ID задачи'})
  @ApiQuery({name: 'userId', type: Number, description: 'ID пользователя'})
  @ApiResponse({
    status: 200,
    description:
      'Задача автоматически завершена, награда начислена и запись создана',
  })
  async startTask(
    @Query('userId', ParseIntPipe) userId: number,
    @Param('taskId', ParseIntPipe) taskId: number
  ) {
    return this.userTasksService.startTask(userId, taskId);
  }
}
