import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { NODE_ENV } from './shared/enums';
import { ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationException } from './shared/exceptions';
import { ValidationFilter } from './shared/filters';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors()
  app.setGlobalPrefix('api/v1');
  app.useGlobalFilters(new ValidationFilter());
  app.useGlobalPipes(new ValidationPipe({
    transform: true, // automatically transform payloads to be objects typed according to their DTO classes
    whitelist: true, // automatically remove non-whitelisted properties
    exceptionFactory: (errors: ValidationError[]) => {
      return new ValidationException(errors)
    }
  }));

  if (process.env.ENV == NODE_ENV.DEVELOPMENT) {
    const swaggerOptions = new DocumentBuilder()
      .setTitle('NESTJS Auth with Roles and Permissions')
      .setDescription('APIs for NestJs Template.')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, swaggerOptions, {
      ignoreGlobalPrefix: false,
    });
    SwaggerModule.setup('api/v1/docs', app, document);
  }

  await app.listen(process.env.APP_PORT || 3000);
}
bootstrap();
