import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { UserRole } from '../entities/user.entity';
import { UsersService } from '../users.service';

@Injectable()
export class RolesService {
  @Inject(CACHE_MANAGER)
  private cache: Cache;

  @Inject(forwardRef(() => UsersService))
  private usersService: UsersService;

  async userRole(userId: number): Promise<UserRole | null> {
    const role = await this.fromCache(userId);

    if (role) {
      return role;
    }

    const user = await this.usersService.findById(userId);

    if (!user) {
      return null;
    }

    void this.cache.set(RolesService.roleCacheKey(userId), user.role);

    return user.role;
  }

  dropCache(userId: number): Promise<void> {
    return this.cache.del(RolesService.roleCacheKey(userId));
  }

  private fromCache(userId: number): Promise<UserRole | undefined> {
    return this.cache.get(`user:role:${userId}`);
  }

  private static roleCacheKey(userId: number): string {
    return `user:role:${userId}`;
  }
}
