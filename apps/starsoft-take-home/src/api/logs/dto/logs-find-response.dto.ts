import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../dto/paginated-response.dto';
import { Log } from '@app/shared-entities';

export class LogsFindResponseDto extends PaginatedResponseDto {
  @ApiProperty()
  logs: Log[];
}
