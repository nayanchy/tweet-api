import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { HashtagService } from './hashtag.service';
import { CreateHashtagDto } from './dto/create-hashtag.dto';

@Controller('hashtag')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Get()
  getAllHashtags() {
    return this.hashtagService.getAllHashtags();
  }

  @Get(':id')
  getHashtagById(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.getHashtagById(id);
  }

  @Post()
  createHashtag(@Body() name: CreateHashtagDto) {
    return this.hashtagService.createHashtag(name);
  }

  @Delete(':id')
  deleteHashtag(@Param('id', ParseIntPipe) id: number) {
    return this.hashtagService.deleteHashtag(id);
  }
}
