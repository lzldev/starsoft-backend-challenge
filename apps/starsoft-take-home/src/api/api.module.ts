import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/strategies/jwt/jwt.guard';
import { RoleGuard } from './user/role/role.guard';
import { LogsModule } from './logs/logs.module';

@Module({
  imports: [UserModule, AuthModule, LogsModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
})
export class ApiModule {}
