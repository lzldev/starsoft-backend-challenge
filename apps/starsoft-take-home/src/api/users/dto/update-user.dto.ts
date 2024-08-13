import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';
import { BaseUserDTO } from './base-user.dto';

export class UpdateUserDto extends PartialType(
  PickType(BaseUserDTO, ['username', 'role']),
) {
  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
