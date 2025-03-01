import { Module } from '@nestjs/common';
import { LevelConfigService } from './level-config.service';
import { LevelConfigController } from './level-config.controller';

@Module({
  controllers: [LevelConfigController],
  providers: [LevelConfigService],
})
export class LevelConfigModule {}
