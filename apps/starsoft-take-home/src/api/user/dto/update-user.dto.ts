import { IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../entities/user.entity';
import { CreateUserDTO } from './create-user.dto';
import { ApiProperty, PartialType, PickType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(
  PickType(CreateUserDTO, ['username']),
) {
  @ApiProperty({
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}
