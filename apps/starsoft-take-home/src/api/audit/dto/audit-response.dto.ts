import { ApiProperty } from '@nestjs/swagger';
import { PaginatedResponseDto } from '../../dto/paginated-response.dto';
import { Events } from '@app/shared-entities';

export class AuditFindResponseDto extends PaginatedResponseDto {
  @ApiProperty()
  events: Events[];
}
