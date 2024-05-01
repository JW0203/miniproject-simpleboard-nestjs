import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreatePostRequestDto } from './dto/createPost.request.dto';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  @HttpCode(201)
  create(@Body() createPostRequestDto: CreatePostRequestDto) {
    return this.boardService.create(createPostRequestDto);
  }
}
