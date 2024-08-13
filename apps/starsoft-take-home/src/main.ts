import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { HttpUserErrorFilter } from './error/userError.filter';
import { IgnoreEmptyObjectsPipe } from './pipes/ignoreEmpty.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new HttpUserErrorFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      always: true,
      validateCustomDecorators: true,
    }),
    new IgnoreEmptyObjectsPipe(),
  );

  if (process.env['SWAGGER']) {
    const config = new DocumentBuilder()
      .setTitle('Starsoft Backend Challenge API')
      .setDescription('OpenAPI spec for the Startsoft Backend Challenge')
      .setVersion('0.1')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  await app.listen(process.env['API_PORT'] || 3000);
}
bootstrap();
