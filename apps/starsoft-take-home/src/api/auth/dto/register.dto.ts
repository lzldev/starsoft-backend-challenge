import { PickType } from '@nestjs/swagger';
import { IsEmail, IsString, Max, Min } from 'class-validator';
import { CreateUserDTO } from '../../user/dto/create-user.dto';

export class RegisterDto extends PickType(CreateUserDTO, [
  'username',
  'password',
  'email',
]) {}
