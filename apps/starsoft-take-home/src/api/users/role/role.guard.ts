import { Request } from 'express';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UserPayload } from '../../auth/user-payload.interface';
import { UserRole } from '../entities/user.entity';
import { Reflector } from '@nestjs/core';

export const ROLES_METADATA_KEY = 'roles';

export class RoleGuard implements CanActivate {
  @Inject()
  private usersService: UsersService;

  @Inject()
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const roles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_METADATA_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!roles) {
      return true;
    }

    const req = context.switchToHttp().getRequest<Request>();
    const payload = req.user as UserPayload | undefined;

    if (!payload) {
      return false;
    }

    const user = await this.usersService.findById(payload.id);

    if (!user) {
      return false;
    }

    return true;
  }
}
