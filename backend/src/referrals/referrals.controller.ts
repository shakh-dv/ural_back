import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Query,
} from '@nestjs/common';
import {ReferralsService} from './referrals.service';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post('reward/:id')
  async rewardInviter(@Param('id', ParseIntPipe) referralId: number) {
    return this.referralsService.rewardInviter(referralId);
  }

  @Get('referral-link')
  async getReferralLink(@Query('userId') userId: number) {
    return this.referralsService.generateReferralLink(userId);
  }

  @Get(':id')
  async getReferrals(@Param('id', ParseIntPipe) id: number) {
    return this.referralsService.getReferralsByUser(id);
  }
}
