import {Controller, Get, Post, Body, Param, ParseIntPipe} from '@nestjs/common';
import {LevelsService} from './levels.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Levels')
@Controller('level')
export class LevelsController {
  constructor(private readonly levelsService: LevelsService) {}

  @Get(':userId')
  @ApiOperation({
    summary: 'Получить текущий уровень, XP и максимальную энергию',
  })
  @ApiParam({name: 'userId', type: Number, description: 'ID пользователя'})
  @ApiResponse({status: 200, description: 'Данные уровня и опыта'})
  async getLevel(@Param('userId', ParseIntPipe) userId: number) {
    return this.levelsService.getUserLevel(userId);
  }

  @Post('/xp/add')
  @ApiOperation({summary: 'Добавить XP пользователю'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {type: 'number'},
        xp: {type: 'number'},
      },
      required: ['userId', 'xp'],
    },
  })
  @ApiResponse({
    status: 200,
    description: 'XP добавлен, возможно повышение уровня',
  })
  async addXP(@Body() data: {userId: number; xp: number}) {
    return this.levelsService.addXP(data.userId, data.xp);
  }

  @Post('/xp/reset')
  @ApiOperation({summary: 'Сбросить XP и уровень пользователя'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: {type: 'number'},
      },
      required: ['userId'],
    },
  })
  @ApiResponse({status: 200, description: 'XP и уровень сброшены'})
  async resetXP(@Body() data: {userId: number}) {
    return this.levelsService.resetXP(data.userId);
  }
}
