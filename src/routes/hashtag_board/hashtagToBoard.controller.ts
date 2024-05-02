import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { HashtagToBoardService } from './hashtagToBoard.service';

@Controller('hashtagToBoard')
export class HashtagToBoardController {
  constructor(private readonly hashtagToBoardService: HashtagToBoardService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.hashtagToBoardService.findAll();
  }
}
