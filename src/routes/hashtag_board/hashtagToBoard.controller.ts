import { Controller, Get } from '@nestjs/common';
import { HashtagToBoardService } from './hashtagToBoard.service';

@Controller('hashtagToBoard')
export class HashtagToBoardController {
  constructor(private readonly hashtagToBoardService: HashtagToBoardService) {}

  @Get()
  findAll() {
    return this.hashtagToBoardService.findAll();
  }
}
