import {
  Controller,
  Post,
  Get,
  Body,
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
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.questionsService.createQuestion(text, image);
  }

  @Get()
  getQuestions() {
    return this.questionsService.getQuestions();
  }
}
