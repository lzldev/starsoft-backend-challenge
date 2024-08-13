import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class BaseUserDTO {
  @IsString()
  @MinLength(3, {
    message: 'Username is too short it should be at least 3 characters long',
  })
  @MaxLength(30, {
    message: 'Username is too long',
  })
  username: string;

  @IsString()
  @MinLength(5, {
    message: 'Password is too short',
  })
  @MaxLength(30, {
    message: 'Password is too long',
  })
  password: string;

  @IsEmail()
  email: string;

  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
