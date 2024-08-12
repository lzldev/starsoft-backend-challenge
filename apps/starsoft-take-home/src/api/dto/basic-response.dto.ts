import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class BasicResponseDto {
  @IsString()
  @ApiProperty()
  message: string;
}
