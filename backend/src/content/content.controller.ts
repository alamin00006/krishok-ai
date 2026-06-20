import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { ContentService } from './content.service';

@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Get()
  getContent() {
    return this.contentService.getAll();
  }

  @Get(':section/:id')
  getDetail(@Param('section') section: string, @Param('id') id: string) {
    const item = this.contentService.getDetail(section, id);
    if (!item) throw new NotFoundException('Content item not found');
    return item;
  }
}
