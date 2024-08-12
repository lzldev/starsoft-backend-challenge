import { IntersectionType } from '@nestjs/swagger';
import { PaginationDto } from '../../dto/pagination.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class TemporalQuery {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  from?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  until?: number;
}

export class FindLogsQueryDto extends IntersectionType(
  PaginationDto,
  TemporalQuery,
) {}
