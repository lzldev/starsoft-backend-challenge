import { Controller, Get } from '@nestjs/common';
import { LogConsumerService } from './log-consumer.service';

@Controller()
export class LogConsumerController {
  constructor(private readonly logConsumerService: LogConsumerService) {}

  @Get()
  getHello(): string {
    return this.logConsumerService.getHello();
  }
}
