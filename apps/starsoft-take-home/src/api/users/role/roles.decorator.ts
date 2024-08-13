import { SetMetadata } from '@nestjs/common';
import { ROLES_METADATA_KEY } from './role.guard';
import { UserRole } from '../entities/user.entity';

/**
 *  Restricts a Route or a Controller to specific Roles
 */
export const Roles = (...roles: UserRole[]) =>
  SetMetadata(ROLES_METADATA_KEY, roles);
