import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './config/configuration';
import { ApiModule } from './api/api.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KAFKA_CLIENT_KEY } from './api/api.constants';

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
    ApiModule,
  ],
})
export class AppModule {}
