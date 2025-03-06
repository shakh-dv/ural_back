import {Module} from '@nestjs/common';
import {BoostItemsService} from './boost-items.service';
import {BoostItemsController} from './boost-items.controller';

@Module({
  controllers: [BoostItemsController],
  providers: [BoostItemsService],
})
export class BoostItemsModule {}
