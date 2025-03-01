import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query, ParseIntPipe,
} from '@nestjs/common';
import {TasksService} from './tasks.service';
import {CreateTaskDto} from './dto/create-task.dto';
import {UpdateTaskDto} from './dto/update-task.dto';
import {GetTasksFilterDto} from './dto/get-tasks-filter.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Tasks (Admin)')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ApiOperation({summary: 'Получить список задач с фильтрацией и пагинацией'})
  @ApiQuery({
    name: 'taskType',
    required: false,
    enum: ['click', 'subscribe', 'external'],
  })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'inProgress', 'completed', 'failed'],
  })
  @ApiQuery({name: 'page', required: false, type: Number})
  @ApiQuery({name: 'limit', required: false, type: Number})
  @ApiResponse({
    status: 200,
    description: 'Список задач с информацией о пагинации',
  })
  async getTasks(@Query() filterDto: GetTasksFilterDto) {
    return this.tasksService.getAllTasks(filterDto);
  }

  @Get(':id')
  @ApiOperation({summary: 'Получить задачу по ID'})
  @ApiParam({name: 'id', type: Number, description: 'ID задачи'})
  async getTaskById(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.getTaskById(id);
  }

  @Post()
  @ApiOperation({summary: 'Создать новую задачу'})
  @ApiBody({type: CreateTaskDto})
  async createTask(@Body() data: CreateTaskDto) {
    return this.tasksService.createTask(data);
  }

  @Patch(':id')
  @ApiOperation({summary: 'Обновить задачу'})
  @ApiParam({name: 'id', type: Number, description: 'ID задачи'})
  @ApiBody({type: UpdateTaskDto})
  async updateTask(@Param('id', ParseIntPipe) id: number, @Body() data: UpdateTaskDto) {
    return this.tasksService.updateTask(id, data);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Удалить задачу'})
  @ApiParam({name: 'id', type: Number, description: 'ID задачи'})
  async deleteTask(@Param('id', ParseIntPipe) id: number) {
    return this.tasksService.deleteTask(id);
  }
}
