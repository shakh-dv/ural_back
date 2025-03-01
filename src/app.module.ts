import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {ClsModule} from 'nestjs-cls';
import {LoggerModule} from './core/infra/logger/logger.module';
import {v4 as uuid} from 'uuid';
import {ConfigModule} from '@nestjs/config';
import {UsersModule} from './users/users.module';
import {PrismaModule} from './core/infra/prisma/prisma.module';
import {AuthModule} from './auth/auth.module';
import {ReferralsModule} from './referrals/referrals.module';
import {TapsModule} from './taps/taps.module';
import {LevelsModule} from './levels/levels.module';
import {TasksModule} from './tasks/tasks.module';
import {UserTasksModule} from './user-tasks/user-tasks.module';
import {LevelConfigModule} from './level-config/level-config.module';
import {BoostItemsModule} from './boost-items/boost-items.module';
import {BoostEffectsModule} from './boost-effects/boost-effects.module';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),
    ClsModule.forRoot({
      middleware: {
        mount: true,
        generateId: true,
        idGenerator(request): string {
          return request.headers['x-request-id'] ?? uuid();
        },
      },
      global: true,
    }),
    LoggerModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ReferralsModule,
    TapsModule,
    LevelsModule,
    TasksModule,
    UserTasksModule,
    LevelConfigModule,
    BoostItemsModule,
    BoostEffectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
