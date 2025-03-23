import {Controller, Get, Query} from '@nestjs/common';
import {ApiOperation, ApiQuery, ApiResponse, ApiTags} from '@nestjs/swagger';
import {TelegramService} from './telegram.service';

@ApiTags('Telegram') // Группа в Swagger
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  @ApiOperation({summary: 'Проверка подписки пользователя на канал'})
  @ApiQuery({
    name: 'userId',
    type: String,
    description: 'Telegram ID пользователя',
  })
  @ApiResponse({
    status: 200,
    description: 'Статус подписки',
    schema: {example: {isSubscribed: true}},
  })
  @Get('check-subscription')
  async checkSubscription(@Query('userId') userId: string) {
    const isSubscribed = await this.telegramService.isUserSubscribed(
      Number(userId)
    );
    return {isSubscribed};
  }
}
