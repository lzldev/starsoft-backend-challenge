import { Request } from 'express';
import { CanActivate, ExecutionContext, Inject } from '@nestjs/common';
import { UserPayload } from '../../auth/user-payload.interface';
import { UserRole } from '../entities/user.entity';
import { Reflector } from '@nestjs/core';
import { RolesService } from './roles.service';

export const ROLES_METADATA_KEY = 'roles';

export class RolesGuard implements CanActivate {
  @Inject()
  private reflector: Reflector;

  @Inject()
  private rolesService: RolesService;

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

    const userRole = await this.rolesService.userRole(payload.id);

    if (!userRole || !roles.includes(userRole)) {
      return false;
    }

    return true;
  }
}
