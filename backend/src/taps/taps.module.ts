import {Module} from '@nestjs/common';
import {TapsService} from './taps.service';
import {TapsController} from './taps.controller';

@Module({
  controllers: [TapsController],
  providers: [TapsService],
})
export class TapsModule {}
