import { BaseUserDTO } from './base-user.dto';
import { OmitType } from '@nestjs/swagger';

export class CreateUserDTO extends OmitType(BaseUserDTO, ['role']) {}
