import { Controller, Get, Inject, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { FindLogsQueryDto } from './dto/logs-find-query.dto';
import { Roles } from '../user/role/roles.decorator';
import { UserRole } from '../user/entities/user.entity';
import { LogsFindResponseDto } from './dto/logs-find-response.dto';

@ApiTags('logs')
@Controller('logs')
@ApiBearerAuth()
export class LogsController {
  @Inject()
  private logsService: LogsService;

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiResponse({
    type: LogsFindResponseDto,
  })
  findAll(@Query() pagination: FindLogsQueryDto): Promise<LogsFindResponseDto> {
    return this.logsService.findPaginated(pagination);
  }
}
