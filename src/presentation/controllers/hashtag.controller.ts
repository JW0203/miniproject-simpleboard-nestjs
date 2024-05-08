import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { HashtagService } from '../../application/services/hashtag.service';
import { CreateHashtagRequestDto } from '../../application/dto/createHashtag.request.dto';

@Controller('hashtags')
export class HashtagController {
  constructor(private readonly hashtagService: HashtagService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createHashtagRequestDto: CreateHashtagRequestDto) {
    return this.hashtagService.create(createHashtagRequestDto);
  }

  @Get(':name')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('name') name: string) {
    return this.hashtagService.findOne(name);
  }
}
