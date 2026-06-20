import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { UploadModule } from './upload/upload.module';
import { QuestionsModule } from './questions/questions.module';
import { ContentModule } from './content/content.module';
import { UsersModule } from './users/users.module';
import { ConversationsModule } from './conversations/conversations.module';

@Module({
  imports: [
    PrismaModule,
    AiModule,
    UploadModule,
    QuestionsModule,
    ContentModule,
    UsersModule,
    ConversationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
