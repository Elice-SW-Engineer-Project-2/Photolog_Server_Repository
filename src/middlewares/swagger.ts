import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const setupSwagger = (app: INestApplication): void => {
  const document = new DocumentBuilder()
    .setTitle('Photolog APi문서')
    .setVersion('0.0.1')
    .addBearerAuth(
      {
        in: 'header',
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
      'Authorization',
    )
    .build();

  const swagger = SwaggerModule.createDocument(app, document);
  SwaggerModule.setup('/docs', app, swagger);
};
