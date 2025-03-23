import {Module} from '@nestjs/common';
import {UserTasksService} from './user-tasks.service';
import {UserTasksController} from './user-tasks.controller';
import {TelegramModule} from '../telegram/telegram.module';

@Module({
  imports: [TelegramModule],
  controllers: [UserTasksController],
  providers: [UserTasksService],
})
export class UserTasksModule {}
