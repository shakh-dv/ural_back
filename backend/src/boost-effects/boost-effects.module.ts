import {Module} from '@nestjs/common';
import {BoostEffectsService} from './boost-effects.service';
import {BoostEffectsController} from './boost-effects.controller';
import {ScheduleModule} from '@nestjs/schedule';

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [BoostEffectsController],
  providers: [BoostEffectsService],
})
export class BoostEffectsModule {}
