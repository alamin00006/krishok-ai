import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Param,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { QuestionsService } from './questions.service';

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  createQuestion(
    @Body('text') text: string,
    @Body('guestId') guestId: string,
    @UploadedFile() image?: any | undefined,
  ) {
    return this.questionsService.createGuestQuestion(text, guestId, image);
  }

  @Get()
  getQuestions(@Query('guestId') guestId: string) {
    return this.questionsService.getGuestQuestions(guestId);
  }

  @Patch(':id/feedback')
  setFeedback(
    @Param('id') id: string,
    @Body('feedback') feedback: string,
    @Body('userId') userId?: string,
    @Body('guestId') guestId?: string,
  ) {
    return this.questionsService.setFeedback(id, feedback, userId, guestId);
  }
}
