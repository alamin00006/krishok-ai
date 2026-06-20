import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';

const GUEST_QUESTION_LIMIT = 5;

@Injectable()
export class QuestionsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly uploadService: UploadService,
  ) {}

  async createGuestQuestion(
    text: string,
    guestId: string,
    file?: Express.Multer.File,
  ) {
    const cleanText = text?.trim();
    const cleanGuestId = guestId?.trim();
    if (!cleanText) throw new BadRequestException('Question text is required');
    if (!cleanGuestId) throw new BadRequestException('guestId is required');

    const used = await this.prisma.question.count({
      where: { guestId: cleanGuestId },
    });
    if (used >= GUEST_QUESTION_LIMIT) {
      throw new ForbiddenException(
        'Guest question limit reached. Please create an account to continue.',
      );
    }

    let imageUrl: string | undefined;
    if (file) imageUrl = await this.uploadService.uploadImage(file);

    const aiAnswer = await this.aiService.askKrishokAi(
      imageUrl
        ? `${cleanText}\nUser also uploaded crop image: ${imageUrl}`
        : cleanText,
    );

    return this.prisma.question.create({
      data: { text: cleanText, imageUrl, aiAnswer, guestId: cleanGuestId },
    });
  }

  async getGuestQuestions(guestId: string) {
    const cleanGuestId = guestId?.trim();
    if (!cleanGuestId) throw new BadRequestException('guestId is required');
    const questions = await this.prisma.question.findMany({
      where: { guestId: cleanGuestId },
      orderBy: { createdAt: 'asc' },
    });
    return {
      questions,
      used: questions.length,
      limit: GUEST_QUESTION_LIMIT,
      remaining: Math.max(0, GUEST_QUESTION_LIMIT - questions.length),
    };
  }
}
