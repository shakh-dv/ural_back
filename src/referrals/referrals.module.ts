import {Module} from '@nestjs/common';
import {ReferralsService} from './referrals.service';
import {ReferralsController} from './referrals.controller';
import {UsersService} from '../users/users.service';

@Module({
  controllers: [ReferralsController],
  providers: [ReferralsService, UsersService],
})
export class ReferralsModule {}
