import { Events } from '@app/shared-entities';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { AuditQueryDto } from './dto/audit-query.dto';

@Injectable()
export class AuditService {
  @InjectRepository(Events)
  private auditRepository: Repository<Events>;

  private static alias = 'audit';

  async findPaginated(pagination: AuditQueryDto) {
    let query = this.auditRepository.createQueryBuilder(AuditService.alias);

    query = AuditService.withTimeStamp(query, pagination);

    const [events, count] = await query
      .orderBy('id', 'DESC')
      .skip(pagination.page * pagination.pageSize)
      .take(pagination.pageSize)
      .getManyAndCount();

    return { events, total: count };
  }

  async findByKeyPaginated(key: string, pagination: AuditQueryDto) {
    let query = this.auditRepository.createQueryBuilder(AuditService.alias);

    query = AuditService.withTimeStamp(query, pagination).andWhere(
      `(${AuditService.alias}.log->> 'key')::text = :search`,
      { search: key },
    );

    const [events, count] = await query
      .orderBy('id', 'DESC')
      .skip(pagination.page * pagination.pageSize)
      .take(pagination.pageSize)
      .getManyAndCount();

    return { events, total: count };
  }

  private static withTimeStamp(
    queryBuilder: SelectQueryBuilder<Events>,
    pagination: AuditQueryDto,
  ) {
    if (!pagination.until || !pagination.from) {
      return queryBuilder;
    }

    return queryBuilder
      .where(`(${AuditService.alias}.log ->> 'timestamp')::NUMERIC <= :until`, {
        until: pagination.until,
      })
      .andWhere(
        `(${AuditService.alias}.log->> 'timestamp')::NUMERIC >= :from`,
        {
          from: pagination.from,
        },
      );
  }
}
