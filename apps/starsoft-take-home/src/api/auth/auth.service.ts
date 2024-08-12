import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { ConfigService } from '@nestjs/config';
import { AppEnv } from '../../app.module';
import { UserError } from '../../error/userError';

@Injectable()
export class AuthService {
  @Inject()
  private userService: UserService;

  @Inject()
  private configService: ConfigService<AppEnv>;

  async validateCredentials(
    username: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      return null;
    }

    const result = await this.userService.comparePassword(user, password);

    if (!result) {
      return null;
    }

    return user;
  }

  async registerUser(registerDto: RegisterDto) {
    const exists = await this.userService.userExists(registerDto);

    if (exists) {
      throw new UserError('User already Exists');
    }

    return await this.userService.createUser(registerDto);
  }
}
