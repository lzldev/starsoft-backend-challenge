import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './strategies/local/local.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AppConfigService } from '../../app.module';
import { JwtStrategy } from './strategies/jwt/jwt.strategy';
import { JwtGuard } from './strategies/jwt/jwt.guard';

@Module({
  imports: [
    UserModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory(configService: AppConfigService) {
        return {
          secret: configService.getOrThrow('JWT_SECRET'),
        };
      },
    }),
  ],
  providers: [LocalStrategy, JwtStrategy, JwtGuard, AuthService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
