import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BCRYPT_ROUNDS } from '../api.constants';
import { InjectKafkaClient } from '../../decorators/kafka.client.decorator';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class UserService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @InjectKafkaClient()
  private kafkaClient: ClientKafka;

  findById(id: number): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  userExists(user: Pick<User, 'username' | 'email'>): Promise<boolean> {
    return this.userRepository.exists({
      where: [{ username: user.username }, { email: user.email }],
    });
  }

  async createUser({ username, password, email }: CreateUserDTO) {
    const hashed_password = await hash(password, BCRYPT_ROUNDS);

    const result = await this.userRepository.create({
      username,
      email,
      hashed_password,
    });

    return result;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const result = await this.userRepository.update(
      {
        id: userId,
      },
      updateUserDto,
    );

    return result;
  }
}
