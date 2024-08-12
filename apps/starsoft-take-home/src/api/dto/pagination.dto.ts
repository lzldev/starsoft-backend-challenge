import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, Max, Min } from 'class-validator';

export class PaginationDto {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(0)
  @ApiProperty({
    required: false,
  })
  page: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Max(10)
  @ApiProperty({
    required: false,
  })
  pageSize: number = 5;
}
