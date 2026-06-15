import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AiService } from './ai/ai.service';
import { AiModule } from './ai/ai.module';
import { UploadModule } from './upload/upload.module';
import { QuestionsModule } from './questions/questions.module';

@Module({
  imports: [PrismaModule, AiModule, UploadModule, QuestionsModule],
  controllers: [AppController],
  providers: [AppService, AiService],
})
export class AppModule {}
