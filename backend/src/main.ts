import { NestFactory } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['http://localhost:4200'],
    methods: ['GET'],
    // allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true,
  });
  
  app.useGlobalPipes(
    new ValidationPipe({
      // Remove unrecognized request body fields
      whitelist: true,
      // Throw and exception for unrecognized request body fields
      forbidNonWhitelisted: true,
      // Convert request body object to a Class
      transform: true,
      transformOptions: {
        // cast string integers and boolean values from request body fields
        enableImplicitConversion: true,
      },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
