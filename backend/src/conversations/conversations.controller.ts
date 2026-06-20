import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  @Get()
  findAll(@Query('userId') userId: string) {
    return this.conversationsService.findAll(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('userId') userId: string) {
    return this.conversationsService.findOne(id, userId);
  }

  @Post()
  create(@Body('userId') userId: string, @Body('title') title?: string) {
    return this.conversationsService.create(userId, title);
  }

  @Post(':id/messages')
  @UseInterceptors(FileInterceptor('image'))
  addMessage(
    @Param('id') id: string,
    @Body('userId') userId: string,
    @Body('text') text: string,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.conversationsService.addMessage(id, userId, text, image);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @Query('userId') userId: string) {
    return this.conversationsService.remove(id, userId);
  }
}
