import { PickType } from '@nestjs/swagger';
import { BaseUserDTO } from '../../users/dto/base-user.dto';

export class RegisterDto extends PickType(BaseUserDTO, [
  'username',
  'password',
  'email',
]) {}
