import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Board, Reply } from '../../entities/entity.index';
import { In, Repository } from 'typeorm';
import { CreateReplyRequestDto } from './dto/createReply.request.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class ReplyService {
  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
    @InjectRepository(Reply)
    private readonly replyRepository: Repository<Reply>,
  ) {}
  @Transactional()
  async createReply(createReplyRequestDto: CreateReplyRequestDto) {
    const { boardId, text } = createReplyRequestDto;
    const board = await this.boardRepository.findOne({ where: { id: boardId } });
    if (!board) {
      throw new NotFoundException(`boardId ${boardId} not found`);
    }
    const newReply = new Reply();
    newReply.text = text;
    newReply.board = board;
    return await this.replyRepository.save(newReply);
  }
  @Transactional()
  async deleteSpecificReply(id: number) {
    const foundReply = await this.replyRepository.findOne({ where: { id } });
    if (!foundReply) {
      throw new NotFoundException(`replyId ${id} not found`);
    }
    await this.replyRepository.softRemove(foundReply);
  }

  @Transactional()
  async deleteReply(ids: number[]) {
    for (const id of ids) {
      await this.deleteSpecificReply(id);
    }
  }
}
