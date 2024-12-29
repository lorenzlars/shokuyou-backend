import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { VersioningType } from '@nestjs/common';
import {
  DocumentBuilder,
  SwaggerDocumentOptions,
  SwaggerModule,
} from '@nestjs/swagger';
import { json, urlencoded } from 'express';

import 'reflect-metadata';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: ['http://localhost:5173', 'https://shokuyou.larslorenz.dev'],
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  // Increase upload limit for handling images
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

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
      operationIdFactory: (controllerKey: string, methodKey: string) =>
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
            value: 'dummy_access_token',
          },
        },
      },
    });
  }

  await app.listen(process.env.PORT ?? 3000);
}

console.log(process.env.MODE);

bootstrap();
