import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('bootstrap');

  const config = new DocumentBuilder()
    .setTitle('Shopify Image Repository Challenge')
    .setDescription(
      'Sign up, then sign in, copy the access token from the sign in response, then add it to the Image APIs by clicking on the authorize button',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
  logger.log(`Application listening on port 3000}`);
}
bootstrap();
