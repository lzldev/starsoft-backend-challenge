import { Injectable } from '@nestjs/common';

@Injectable()
export class LogConsumerService {
  getHello(): string {
    return 'Hello World!';
  }
}
