import { Body, Controller, Delete, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { ReplyService } from './reply.service';
import { CreateReplyRequestDto } from './dto/createReply.request.dto';

@Controller('replies')
export class ReplyController {
  constructor(private readonly replyService: ReplyService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReplyRequestDto: CreateReplyRequestDto) {
    return this.replyService.createReply(createReplyRequestDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string) {
    return this.replyService.deleteSpecificReply(parseInt(id));
  }
}
