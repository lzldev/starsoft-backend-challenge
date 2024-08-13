import { Controller, Inject } from '@nestjs/common';
import { LogConsumerService } from './log-consumer.service';
import { Ctx, Payload } from '@nestjs/microservices';
import { BatchProcessor, KafkaBatchContext } from '@tawk.to/nestjs-batch-kafka';
import { KAFKA_API_LOGS_TOPIC } from '@app/shared-entities/shared.constants';

@Controller()
export class LogConsumerController {
  @Inject()
  private logConsumerService: LogConsumerService;

  @BatchProcessor(KAFKA_API_LOGS_TOPIC)
  async processLogs(@Payload() data: any[], @Ctx() context: KafkaBatchContext) {
    const heartbeat = context.getHeartbeat();
    const resolveOffset = context.getResolveOffset();
    const commitOffsetsIfNecessary = context.getCommitOffsetsIfNecessary();

    await heartbeat();

    const messages = context.getMessages();
    const insert = await this.logConsumerService.insertBatch(data, messages);

    console.info('CONSUMER', `INSERT ${insert.generatedMaps.length} LOGS`);

    resolveOffset(messages.at(-1)!.offset);

    await heartbeat();
    await commitOffsetsIfNecessary();
  }
}
