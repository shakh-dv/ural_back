import {Module} from '@nestjs/common';
import {TapsService} from './taps.service';
import {TapsController} from './taps.controller';
import {LevelsModule} from '../levels/levels.module';

@Module({
  imports: [LevelsModule],
  controllers: [TapsController],
  providers: [TapsService],
})
export class TapsModule {}
