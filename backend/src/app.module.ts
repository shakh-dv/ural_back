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
import {UploadsModule} from './uploads/uploads.module';
import {SERVER_STATIC} from './shared/constants/constants';
import {ServeStaticModule} from '@nestjs/serve-static';
import {TelegramModule} from "./telegram/telegram.module";

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
    ServeStaticModule.forRoot({
      rootPath: SERVER_STATIC.PATH,
      serveRoot: `/${SERVER_STATIC.NAME}`,
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
    UploadsModule,
    TelegramModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
