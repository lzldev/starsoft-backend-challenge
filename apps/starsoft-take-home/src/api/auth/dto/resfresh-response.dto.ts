import { OmitType, PickType } from '@nestjs/swagger';
import { LoginResponseDto } from './login-response.dto';

export class RefreshResponse extends PickType(LoginResponseDto, ['token']) {}
