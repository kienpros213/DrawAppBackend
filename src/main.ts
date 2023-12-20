import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, new ExpressAdapter());
  // Enable CORS
  app.enableCors({
    origin: 'https://p5-websocket.vercel.app/', // Replace with the actual origin of your frontend
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true // Set to true if you need to allow cookies with CORS
  });

  await app.listen(3000);
}
bootstrap();
