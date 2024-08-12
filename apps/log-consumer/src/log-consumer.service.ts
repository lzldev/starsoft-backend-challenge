import { Log } from '@app/shared-entities/log.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { KafkaMessage } from 'kafkajs';
import { Repository } from 'typeorm';

@Injectable()
export class LogConsumerService {
  @InjectRepository(Log)
  logsRepository: Repository<Log>;

  insertBatch(messageData: any[], messages: KafkaMessage[]) {
    const logs = messages.map(({ key, headers, timestamp }, idx) => ({
      log: {
        key: key?.toString() || 'unknown',
        headers: headers as Record<string, string>,
        value: messageData[idx],
        timestamp: parseInt(timestamp),
      },
    }));

    return this.logsRepository.insert(logs);
  }
}
