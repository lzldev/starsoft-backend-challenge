import { Controller } from '@nestjs/common';
import { LogConsumerService } from './log-consumer.service';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class LogConsumerController {
  constructor(private readonly logConsumerService: LogConsumerService) {}

  @MessagePattern('api-logs')
  apiLogs(@Payload() message: any) {
    console.log(message);
  }
}
