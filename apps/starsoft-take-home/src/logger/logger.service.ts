import { Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InjectKafkaClient } from '../decorators/kafka.client.decorator';
import { KAFKA_API_LOGS_TOPIC } from 'global.constants';

@Injectable()
export class LoggerService {
  @InjectKafkaClient()
  private kafkaClient: ClientKafka;

  emitLogEvent(key: string, value: any) {
    return this.kafkaClient.emit(KAFKA_API_LOGS_TOPIC, {
      key,
      value: JSON.stringify(value),
    });
  }
}
