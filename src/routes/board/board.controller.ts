import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
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

  @Get('hashtag/:name')
  @HttpCode(HttpStatus.OK)
  findHashtag(@Param('name') name: string) {
    return this.boardService.findBoardByHashtag(name);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.boardService.findAll();
  }
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.boardService.findOne(parseInt(id));
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  update(@Param('id') id: string, @Body() updateRequest: object) {
    return this.boardService.update(parseInt(id), updateRequest);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBoard(@Param('id') id: string) {
    return this.boardService.deleteBoard(parseInt(id));
  }
}
