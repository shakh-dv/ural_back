import {Module} from '@nestjs/common';
import {BoostEffectsService} from './boost-effects.service';
import {BoostEffectsController} from './boost-effects.controller';

@Module({
  controllers: [BoostEffectsController],
  providers: [BoostEffectsService],
})
export class BoostEffectsModule {}
