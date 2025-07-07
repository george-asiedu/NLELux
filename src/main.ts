import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  allowedHeaders,
  allowedMethods,
  allowedOrigins,
  errorMessages,
  swagger,
} from './shared/utils/constants';
import { Request, Response } from 'express';
import { NotFoundException } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
  });
  app.enableCors({
    origin: allowedOrigins,
    methods: allowedMethods,
    allowedHeaders: allowedHeaders,
    credentials: true,
  });
  app.setGlobalPrefix('api/v1');

  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 1600;

  const options = new DocumentBuilder()
    .setTitle(swagger.swaggerDocsTitle)
    .setDescription(swagger.swaggerDocsDescription)
    .setVersion(swagger.swaggerDocsVersion)
    .addServer(`${swagger.localUrl}${port}/`, 'Local environment')
    .addServer(swagger.productionUrl, 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, options);

  app.use('/api-docs', (req: Request, res: Response, next: () => void) => {
    const host = req.headers.host;
    if (host?.includes('localhost') || host?.includes('127.0.0.1')) {
      next();
    } else {
      res.status(403).send(swagger.noAccess);
    }
  });

  SwaggerModule.setup(swagger.swaggerDocsPath, app, document);

  if (!port) throw new NotFoundException(errorMessages.port);
  await app.listen(port);
}
bootstrap();
