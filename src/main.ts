import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {ORMConfig} from './configuration/configuration';

async function bootstrap() {
  console.log('url', ORMConfig().database)
  const app = await NestFactory.create(AppModule);
  
  await app.listen(3000)
}
bootstrap();
