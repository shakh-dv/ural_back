import {
  forwardRef,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {UsersService} from 'src/users/users.service';
import {ConfigService} from '@nestjs/config';
import {parse, validate} from '@telegram-apps/init-data-node';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly configService: ConfigService
  ) {}

  async verifyTelegramAuth(data: string): Promise<void> {
    const botToken = this.configService.getOrThrow<string>('BOT_TOKEN');
    try {
      validate(data, botToken);
    } catch (e) {
      throw new UnauthorizedException(e);
    }
  }

  async validateUser(data: string) {
    const parsedData = parse(data);
    return this.usersService.findOrCreate(parsedData.user);
  }
}
