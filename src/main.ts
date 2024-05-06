import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { StartService } from './start.service';
import { logger } from './logger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const startService = new StartService();
  await startService.createAdmin();
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(logger);
  await app.listen(3001);
}
bootstrap();
