import { NestFactory } from '@nestjs/core';
import { LogConsumerModule } from './log-consumer.module';
import { KafkaOptions, MicroserviceOptions } from '@nestjs/microservices';
import { KafkaBatchServer } from '@tawk.to/nestjs-batch-kafka';

import {
  KAFKA_MAX_WAIT_TIME_MS_DEFAULT,
  KAFKA_MIN_BYTES_DEFAULT,
} from './log-consumer.constants';
import { PartitionAssigners } from 'kafkajs';

const CLIENT_ID = 'log-consumer';

async function bootstrap() {
  const kafka_server = new KafkaBatchServer({
    client: {
      clientId: CLIENT_ID,
      brokers: process.env['KAFKA_BROKERS']?.split(',') || [],
    },
    run: {
      autoCommit: false,
      autoCommitInterval: 5000,
      autoCommitThreshold: 100,
    },
    consumer: {
      minBytes: KAFKA_MIN_BYTES_DEFAULT,
      maxWaitTimeInMs: KAFKA_MAX_WAIT_TIME_MS_DEFAULT,
      groupId: CLIENT_ID,
      allowAutoTopicCreation: true,
      partitionAssigners: [PartitionAssigners.roundRobin],
    },
  } satisfies KafkaOptions['options'] as any);

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    LogConsumerModule,
    {
      strategy: kafka_server,
    },
  );

  await app.listen();

  process.on('exit', async () => {
    await kafka_server.close();
  });
}
bootstrap();
