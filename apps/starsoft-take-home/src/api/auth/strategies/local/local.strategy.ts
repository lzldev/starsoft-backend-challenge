import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  @Inject()
  authService: AuthService;

  async validate(username: string, password: string): Promise<any> {
    const user = await this.authService.validateCredentials(username, password);

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
