import { NestFactory } from '@nestjs/core';
import { LogConsumerModule } from './log-consumer.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { PartitionAssigners } from 'kafkajs';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    LogConsumerModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          clientId: 'log-consumer',
          brokers: process.env['KAFKA_BROKERS']?.split(',') || [],
        },
        consumer: {
          groupId: 'log-consumer',
          allowAutoTopicCreation: true,
          partitionAssigners: [PartitionAssigners.roundRobin],
        },
      },
    },
  );

  await app.listen();
}
bootstrap();
