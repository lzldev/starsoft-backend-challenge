import { Module } from '@nestjs/common';
import { Events } from '@app/shared-entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';

@Module({
  imports: [TypeOrmModule.forFeature([Events])],
  providers: [AuditService],
  controllers: [AuditController],
})
export class LogsModule {}
