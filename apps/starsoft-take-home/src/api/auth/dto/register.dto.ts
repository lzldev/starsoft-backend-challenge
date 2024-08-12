import { PickType } from '@nestjs/swagger';
import { CreateUserDTO } from '../../user/dto/create-user.dto';

export class RegisterDto extends PickType(CreateUserDTO, [
  'username',
  'password',
  'email',
]) {}
