import {Body, Controller, Post, Query} from '@nestjs/common';
import {ApiTags} from '@nestjs/swagger';
import {TelegramService} from './telegram.service';

@ApiTags('Telegram') // Группа в Swagger
@Controller('telegram')
export class TelegramController {
  constructor(private readonly telegramService: TelegramService) {}

  // @ApiOperation({summary: 'Проверка подписки пользователя на канал'})
  // @ApiQuery({
  //   name: 'userId',
  //   type: String,
  //   description: 'Telegram ID пользователя',
  // })
  // @ApiResponse({
  //   status: 200,
  //   description: 'Статус подписки',
  //   schema: {example: {isSubscribed: true}},
  // })
  // @Get('check-subscription')
  // async checkSubscription(@Query('userId') userId: string) {
  //   const isSubscribed = await this.telegramService.isUserSubscribed(
  //     Number(userId)
  //   );
  //   return {isSubscribed};
  // }

  @Post('extract-link')
  extractLink(@Body('link') link: string) {
    return this.telegramService.extractChatId(link);
  }
}
