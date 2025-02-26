import {forwardRef, Module} from '@nestjs/common';
import {AuthController} from './auth.controller';
import {AuthService} from './auth.service';
import {UsersModule} from 'src/users/users.module';
import {JwtModule} from '@nestjs/jwt';
import {ConfigService} from '@nestjs/config';
import {JwtStrategy} from './strategies/jwt.strategy';
import {PassportModule} from '@nestjs/passport';
import {ReferralsService} from '../referrals/referrals.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    PassportModule,
    JwtModule.registerAsync({
      useFactory(configService: ConfigService) {
        return {
          secret: configService.getOrThrow<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.getOrThrow<string>('JWT_EXPIRES_IN'),
          },
        };
      },
      global: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, ConfigService, ReferralsService],
  exports: [AuthService, JwtStrategy, ConfigService],
})
export class AuthModule {}
