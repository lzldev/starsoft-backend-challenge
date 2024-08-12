import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { FindLogsQueryDto } from './dto/find-query.dto';
import { Roles } from '../user/role/roles.decorator';
import { UserRole } from '../user/entities/user.entity';

@ApiTags('logs')
@Controller('logs')
@ApiBearerAuth()
export class LogsController {
  @Inject()
  private logsService: LogsService;

  @Get()
  @Roles(UserRole.ADMIN)
  findAll(@Query() pagination: FindLogsQueryDto) {
    return this.logsService.findPaginated(pagination);
  }
}
