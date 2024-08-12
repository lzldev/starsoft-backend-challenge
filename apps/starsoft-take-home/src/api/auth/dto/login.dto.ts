import { PickType } from '@nestjs/swagger';
import { CreateUserDTO } from '../../user/dto/create-user.dto';

export class LoginDto extends PickType(CreateUserDTO, [
  'username',
  'password',
]) {}
