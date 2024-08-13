import { Log } from '@app/shared-entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FindLogsQueryDto } from './dto/logs-find-query.dto';

@Injectable()
export class LogsService {
  @InjectRepository(Log)
  private logsRepository: Repository<Log>;

  async findPaginated(pagination: FindLogsQueryDto) {
    let query = this.logsRepository.createQueryBuilder('log');

    if (pagination.until && pagination.from) {
      query = query
        .where(`(log.log ->> 'timestamp')::NUMERIC <= ${pagination.until}`)
        .andWhere(`(log.log->> 'timestamp')::NUMERIC >= ${pagination.from}`);
    }

    const [logs, count] = await query
      .orderBy('log.id', 'DESC')
      .skip(pagination.page * pagination.pageSize)
      .take(pagination.pageSize)
      .getManyAndCount();

    return { logs, total: count };
  }
}
