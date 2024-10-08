import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './config/configuration';
import { ApiModule } from './api/api.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENT_KEY } from './api/api.constants';
import { EventsModule } from './events/events.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-store';
import { RedisClientOptions } from 'redis';

export type AppEnv = {
  DEV: boolean;
  BCRYPT_ROUNDS: string;
  SWAGGER: boolean;
  JWT_SECRET: string;
  DATABASE_DBNAME: string;
  DATABASE_HOST: string;
  DATABASE_PORT: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
  KAFKA_BROKERS: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
};

export type AppConfigService = ConfigService<AppEnv>;

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      load: [configuration],
      envFilePath: ['.env', '.env.development.local'],
    }),
    ClientsModule.registerAsync({
      isGlobal: true,
      clients: [
        {
          name: KAFKA_CLIENT_KEY,
          inject: [ConfigService],
          useFactory: (configService: AppConfigService) => {
            return {
              transport: Transport.KAFKA,
              options: {
                client: {
                  clientId: 'API',
                  brokers: configService
                    .getOrThrow<string>('KAFKA_BROKERS')
                    .split(','),
                },
                producerOnlyMode: true,
              },
            };
          },
        },
      ],
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (configService: AppConfigService) => {
        return {
          store: redisStore as any,
          url: `redis://${configService.getOrThrow<string>('REDIS_HOST')}:${configService.getOrThrow<string>('REDIS_PORT')}`,
          ttl: 10,
        };
      },
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: AppConfigService) => {
        return {
          type: 'postgres',
          autoLoadEntities: true,
          database: configService.getOrThrow('DATABASE_DBNAME'),
          host: configService.getOrThrow('DATABASE_HOST'),
          port: configService.get('DATABASE_PORT', 5432),
          username: configService.getOrThrow('DATABASE_USERNAME'),
          password: configService.getOrThrow('DATABASE_PASSWORD'),
          logging: configService.get('DEV') ? ['query', 'error'] : [],
          synchronize: configService.get('DEV'),
        };
      },
    }),
    EventsModule,
    ApiModule,
  ],
})
export class AppModule {}
