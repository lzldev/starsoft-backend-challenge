import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { InsertResult, Repository } from 'typeorm';
import { compare, hash } from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { BCRYPT_ROUNDS } from '../../constants';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  comparePassword(user: User, password: string): Promise<boolean> {
    return compare(password, user.hashed_password);
  }

  userExists(user: Pick<User, 'username' | 'email'>): Promise<boolean> {
    return this.userRepository.exists({
      where: [{ username: user.username }, { email: user.email }],
    });
  }

  async createUser({ username, password, email }: CreateUserDTO) {
    const hashed_password = await hash(password, BCRYPT_ROUNDS);

    return this.userRepository.insert({
      username,
      email,
      hashed_password,
    });
  }
}
