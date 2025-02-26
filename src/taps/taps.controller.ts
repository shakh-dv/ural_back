import {Controller, Get, Post, Query, Body, ParseIntPipe} from '@nestjs/common';
import {TapsService} from './taps.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('Taps')
@Controller('taps')
export class TapsController {
  constructor(private readonly tapsService: TapsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Получить текущее количество тапов и время до следующего восстановления',
  })
  @ApiQuery({name: 'userId', type: Number, description: 'ID пользователя'})
  @ApiResponse({status: 200, description: 'Актуальное состояние тапов'})
  async getTaps(@Query('userId', ParseIntPipe) userId: number) {
    return this.tapsService.getTaps(userId);
  }

  @Post('use')
  @ApiOperation({summary: 'Использовать тап (расход энергии)'})
  @ApiQuery({name: 'userId', type: Number, description: 'ID пользователя'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        amount: {
          type: 'number',
          description: 'Количество тапов для расхода',
          default: 1,
        },
      },
      required: ['amount'],
    },
  })
  @ApiResponse({status: 200, description: 'Тапы успешно потрачены'})
  async useTaps(
    @Query('userId', ParseIntPipe) userId: number,
    @Body() data: {amount: number}
  ) {
    return this.tapsService.useTaps(userId, data.amount);
  }

  @Post('boost')
  @ApiOperation({
    summary: 'Активировать буст для ускорения восстановления тапов',
  })
  @ApiQuery({name: 'userId', type: Number, description: 'ID пользователя'})
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        speedUp: {type: 'number', description: 'Скорость ускорения в минутах'},
        duration: {type: 'number', description: 'Длительность буста в минутах'},
      },
      required: ['speedUp', 'duration'],
    },
  })
  @ApiResponse({status: 200, description: 'Буст активирован'})
  async boostTaps(
    @Query('userId', ParseIntPipe) userId: number,
    @Body() boostData: {speedUp: number; duration: number}
  ) {
    return this.tapsService.boostTaps(userId, boostData);
  }

  @Post('bonus')
  @ApiOperation({summary: 'Активировать ежедневный бонус (3 раза в день)'})
  @ApiQuery({name: 'userId', type: Number, description: 'ID пользователя'})
  @ApiResponse({status: 200, description: 'Бонус применён'})
  async claimBonus(@Query('userId', ParseIntPipe) userId: number) {
    return this.tapsService.claimTapBonus(userId);
  }
}
