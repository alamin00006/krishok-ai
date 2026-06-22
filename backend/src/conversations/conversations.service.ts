import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AiService } from '../ai/ai.service';
import { PrismaService } from '../prisma/prisma.service';
import { UploadService } from '../upload/upload.service';

@Injectable()
export class ConversationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly aiService: AiService,
    private readonly uploadService: UploadService,
  ) {}

  async findAll(userId: string) {
    this.requireValue(userId, 'userId');
    return this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: {
        _count: { select: { questions: true } },
        questions: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          select: { text: true, createdAt: true },
        },
      },
    });
  }

  async findOne(id: string, userId: string) {
    this.requireValue(userId, 'userId');
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, userId },
      include: { questions: { orderBy: { createdAt: 'asc' } } },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    return conversation;
  }

  async create(userId: string, title?: string) {
    this.requireValue(userId, 'userId');
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!user) throw new NotFoundException('User not found');

    return this.prisma.conversation.create({
      data: {
        userId,
        title: this.makeTitle(title),
      },
      include: { questions: true },
    });
  }

  async addMessage(
    conversationId: string,
    userId: string,
    text: string,
    file?: Express.Multer.File,
  ) {
    this.requireValue(userId, 'userId');
    const cleanText = text?.trim();
    if (!cleanText) throw new BadRequestException('Message text is required');

    const conversation = await this.prisma.conversation.findFirst({
      where: { id: conversationId, userId },
      include: {
        questions: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          select: { text: true, aiAnswer: true },
        },
      },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');

    let imageUrl: string | undefined;
    if (file) imageUrl = await this.uploadService.uploadImage(file);

    const history = [...conversation.questions]
      .reverse()
      .flatMap((question) => [
        { role: 'user' as const, content: question.text },
        ...(question.aiAnswer
          ? [{ role: 'assistant' as const, content: question.aiAnswer }]
          : []),
      ]);

    const aiAnswer = await this.aiService.askKrishokAi(
      cleanText,
      history,
      imageUrl,
    );

    const [question] = await this.prisma.$transaction([
      this.prisma.question.create({
        data: {
          text: cleanText,
          imageUrl,
          aiAnswer,
          userId,
          conversationId,
        },
      }),
      this.prisma.conversation.update({
        where: { id: conversationId },
        data: {
          updatedAt: new Date(),
          ...(conversation.questions.length === 0
            ? { title: this.makeTitle(cleanText) }
            : {}),
        },
      }),
    ]);

    return question;
  }

  async remove(id: string, userId: string) {
    const conversation = await this.prisma.conversation.findFirst({
      where: { id, userId },
      select: { id: true },
    });
    if (!conversation) throw new NotFoundException('Conversation not found');
    await this.prisma.conversation.delete({ where: { id } });
    return { success: true };
  }

  private requireValue(value: string, field: string) {
    if (!value?.trim()) throw new BadRequestException(`${field} is required`);
  }

  private makeTitle(value?: string) {
    const clean = value?.trim() || 'নতুন কৃষি আলোচনা';
    return clean.length > 55 ? `${clean.slice(0, 55)}…` : clean;
  }
}
