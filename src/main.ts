import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';

import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { snapshot: true });

  app.enableCors({
    origin: ['http://localhost:5173', 'https://shokuyou.larslorenz.dev'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  if (process.env.MODE === 'development') {
    const config = new DocumentBuilder()
      .setTitle('Shokuyou')
      .setDescription('The Shokuyou API description')
      .setVersion('0.0.1')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description:
            'Geben Sie Ihren JWT-Token ein, um die API zu authentifizieren',
        },
        'access-token',
      )
      .build();
    const options: SwaggerDocumentOptions = {
      operationIdFactory: (_controllerKey: string, methodKey: string) =>
        methodKey,
    };
    const document = SwaggerModule.createDocument(app, config, options);

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        authAction: {
          'access-token': {
            name: 'Bearer',
            schema: {
              type: 'http',
              in: 'header',
              scheme: 'bearer',
              bearerFormat: 'JWT',
            },
          },
        },
      },
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
