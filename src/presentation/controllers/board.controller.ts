import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { BoardService } from '../../application/services/board.service';
import { CreatePostRequestDto } from '../../application/dto/createPost.request.dto';
import { UpdateBoardRequestDto } from '../../application/dto/updateBoard.request.dto';

@Controller('boards')
export class BoardController {
  constructor(private boardService: BoardService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createPostRequestDto: CreatePostRequestDto) {
    return this.boardService.create(createPostRequestDto);
  }

  @Get('category/:name')
  @HttpCode(HttpStatus.OK)
  findCategory(@Param('id') id: number) {
    return this.boardService.findBoardByCategory(id);
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
  update(@Param('id') id: string, @Body() updateRequest: UpdateBoardRequestDto) {
    return this.boardService.update(parseInt(id), updateRequest);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deleteBoard(@Param('id') id: string) {
    return this.boardService.deleteBoard(parseInt(id));
  }
}
