import { applyDecorators, Inject } from '@nestjs/common';
import { KAFKA_CLIENT_KEY } from '../api/api.constants';

/**
 * Injects the Kafka Client
 */
export const InjectKafkaClient = () =>
  applyDecorators(Inject(KAFKA_CLIENT_KEY));
