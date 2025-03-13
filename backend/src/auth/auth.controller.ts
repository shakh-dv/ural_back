import {Body, Controller, Post, Query} from '@nestjs/common';
import {AuthService} from './auth.service';
import {ApiBearerAuth, ApiTags} from '@nestjs/swagger';
import {ReferralsService} from '../referrals/referrals.service';
import * as console from 'console';

@ApiBearerAuth()
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly referralsService: ReferralsService
  ) {}

  @Post('login')
  async login(
    @Body('data') initData: string,
    @Query('start') referralCode?: string
  ) {
    await this.authService.verifyTelegramAuth(initData);
    const user = await this.authService.validateUser(initData);

    if (referralCode) {
      await this.referralsService.handleReferral(referralCode, user.telegramId);
    }

    return {
      userId: user.id,
    };
  }
}
