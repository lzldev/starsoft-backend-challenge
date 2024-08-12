import { Module } from '@nestjs/common';
import { LogConsumerController } from './log-consumer.controller';
import { LogConsumerService } from './log-consumer.service';

@Module({
  imports: [],
  controllers: [LogConsumerController],
  providers: [LogConsumerService],
})
export class LogConsumerModule {}
