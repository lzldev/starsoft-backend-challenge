import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtGuard } from './auth/strategies/jwt/jwt.guard';
import { RoleGuard } from './users/role/role.guard';
import { LogsModule } from './audit/audit.module';

@Module({
  imports: [UsersModule, AuthModule, LogsModule],
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
