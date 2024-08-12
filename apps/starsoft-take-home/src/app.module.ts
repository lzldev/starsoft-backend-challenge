import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { configuration } from './config/configuration';
import { ApiModule } from './api/api.module';

export type AppConfigService = ConfigService<{
  DEV: boolean;
  DATABASE_DBNAME: string;
  DATABASE_HOST: string;
  DATABASE_PORT: string;
  DATABASE_USERNAME: string;
  DATABASE_PASSWORD: string;
}>;

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
        };
      },
    }),
    ApiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
