import { Test, TestingModule } from '@nestjs/testing';
import { LogConsumerController } from './log-consumer.controller';
import { LogConsumerService } from './log-consumer.service';

describe('LogConsumerController', () => {
  let logConsumerController: LogConsumerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [LogConsumerController],
      providers: [LogConsumerService],
    }).compile();

    logConsumerController = app.get<LogConsumerController>(LogConsumerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(logConsumerController.getHello()).toBe('Hello World!');
    });
  });
});
