import {Injectable} from '@nestjs/common';
import {ConfigService} from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class TelegramService {
  private botToken: string;
  private channelUsername: string;

  constructor(private configService: ConfigService) {
    this.botToken = this.configService.getOrThrow<string>('BOT_TOKEN');
    this.channelUsername = this.configService.getOrThrow<string>(
      'TELEGRAM_CHANNEL_USERNAME'
    );
  }

  async isUserSubscribed(userId: any): Promise<boolean> {
    const url = `https://api.telegram.org/bot${this.botToken}/getChatMember`;

    try {
      const response = await axios.get(url, {
        params: {
          chat_id: `@${this.channelUsername}`,
          user_id: userId,
        },
      });

      const status = response.data.result.status;
      return ['member', 'administrator', 'creator'].includes(status);
    } catch (error: any) {
      console.error(
        'Ошибка при проверке подписки:',
        error?.response?.data || error?.message
      );
      return false;
    }
  }
}
