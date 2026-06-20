import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const port = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CLIENT_URL?.split(',') ?? [
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    credentials: true,
  });
  await app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}
bootstrap().catch((err) => {
  console.error('Error starting application:', err);
});
