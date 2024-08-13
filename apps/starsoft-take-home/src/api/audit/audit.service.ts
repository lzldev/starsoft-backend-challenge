import { Events } from '@app/shared-entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditQueryDto } from './dto/audit-query.dto';

const alias = 'audit';

@Injectable()
export class AuditService {
  @InjectRepository(Events)
  private auditRepository: Repository<Events>;

  async findPaginated(pagination: AuditQueryDto) {
    let query = this.auditRepository.createQueryBuilder(alias);

    if (pagination.until && pagination.from) {
      query = query
        .where(`(${alias}.log ->> 'timestamp')::NUMERIC <= :until`, [
          pagination.until,
        ])
        .andWhere(`(${alias}.log->> 'timestamp')::NUMERIC >= :from`, [
          pagination.from,
        ]);
    }

    const [events, count] = await query
      .orderBy('id', 'DESC')
      .skip(pagination.page * pagination.pageSize)
      .take(pagination.pageSize)
      .getManyAndCount();

    return { events, total: count };
  }
}
