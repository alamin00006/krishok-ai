import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AiService } from '../ai/ai.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class QuestionsService {
  constructor(
    private prisma: PrismaService,
    private aiService: AiService,
    private uploadService: UploadService,
  ) {}

  async createQuestion(text: string, file?: Express.Multer.File) {
    let imageUrl: string | undefined;

    if (file) {
      imageUrl = await this.uploadService.uploadImage(file);
    }

    const aiAnswer = await this.aiService.askKrishokAi(
      imageUrl ? `${text}\nUser also uploaded crop image: ${imageUrl}` : text,
    );

    return this.prisma.question.create({
      data: {
        text,
        imageUrl,
        aiAnswer,
      },
    });
  }

  async getQuestions() {
    return this.prisma.question.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }
}
