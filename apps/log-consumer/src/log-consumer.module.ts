import { Module, OnModuleInit } from '@nestjs/common';
import { LogConsumerController } from './log-consumer.controller';
import { LogConsumerService } from './log-consumer.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { TypeOrmModule } from '@nestjs/typeorm';

export type AppEnv = {
  DEV: boolean;
  BROKERS: string[];
  DATABASE_DBNAME: string;
  DATABASE_HOST: string;
  DATABASE_PORT: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
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
        };
      },
    }),
  ],
  controllers: [LogConsumerController],
  providers: [LogConsumerService],
})
export class LogConsumerModule implements OnModuleInit {
  onModuleInit() {
    console.log('Module Init');
  }
}
