import {
  Controller,
  Get,
  Inject,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { AuditQueryDto } from './dto/audit-query.dto';
import { Roles } from '../users/roles/roles.decorator';
import { UserRole } from '../users/entities/user.entity';
import { AuditFindResponseDto } from './dto/audit-response.dto';
import { CacheInterceptor, CacheTTL } from '@nestjs/cache-manager';

@Roles(UserRole.ADMIN)
@ApiTags('audit')
@Controller('audit')
@ApiBearerAuth()
@UseInterceptors(CacheInterceptor)
export class AuditController {
  @Inject()
  private auditService: AuditService;

  /**
   * List events
   */
  @Get()
  @CacheTTL(5)
  findAll(@Query() pagination: AuditQueryDto): Promise<AuditFindResponseDto> {
    return this.auditService.findPaginated(pagination);
  }

  /**
   * List events by key
   */
  @Get('/:key')
  @CacheTTL(5)
  findByKey(
    @Param('key') key: string,
    @Query() pagination: AuditQueryDto,
  ): Promise<AuditFindResponseDto> {
    return this.auditService.findByKeyPaginated(key, pagination);
  }
}
