import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { UserError } from '../../error/userError';
import { compare } from 'bcrypt';
import { UserPayload } from './user-payload.interface';

@Injectable()
export class AuthService {
  @Inject()
  private userService: UserService;

  async validateCredentials(
    username: string,
    password: string,
  ): Promise<UserPayload | null> {
    const user = await this.userService.findByUsername(username);

    if (!user) {
      return null;
    }

    const result = await this.comparePassword(user.hashed_password, password);

    if (!result) {
      return null;
    }

    return this.payloadFromUser(user);
  }

  async registerUser(registerDto: RegisterDto) {
    const exists = await this.userService.userExists(registerDto);

    if (exists) {
      throw new UserError('User already Exists');
    }

    return await this.userService.createUser(registerDto);
  }

  private payloadFromUser({ id, username }: User): UserPayload {
    return {
      id,
      username,
    };
  }

  private comparePassword(
    hashed_password: string,
    password: string,
  ): Promise<boolean> {
    return compare(password, hashed_password);
  }
}
