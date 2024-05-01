import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreatePostRequestDto } from './dto/createPost.request.dto';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createPostRequestDto: CreatePostRequestDto) {
    return this.boardService.create(createPostRequestDto);
  }

  // @Post('transaction')
  // @HttpCode(HttpStatus.OK)
  // createTransaction(@Body() createPostRequestDto: CreatePostRequestDto) {
  //   return this.boardService.create(createPostRequestDto);
  // }

  @Get('category/:name')
  @HttpCode(HttpStatus.OK)
  findCategory(@Param('name') name: string) {
    return this.boardService.findBoardByCategory(name);
  }
  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.boardService.findAll();
  }
}
