import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { hash } from 'bcrypt';
import { CreateUserDTO } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { BCRYPT_ROUNDS } from '../api.constants';
import { EventsService } from '../../events/events.service';

@Injectable()
export class UsersService {
  @InjectRepository(User)
  private userRepository: Repository<User>;

  @Inject()
  private eventsService: EventsService;

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

    const user = await this.userRepository.insert({
      username,
      email,
      hashed_password,
    });

    void this.eventsService.emitLogEvent('user-created', user.generatedMaps);
    return user.generatedMaps;
  }

  async updateUser(userId: number, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.update(
      {
        id: userId,
      },
      updateUserDto,
    );

    void this.eventsService.emitLogEvent('user-updated', user.generatedMaps);
    return user;
  }
}
