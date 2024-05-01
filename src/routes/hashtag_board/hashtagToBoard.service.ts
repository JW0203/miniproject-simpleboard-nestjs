import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagToBoard } from '../../entities/HashtagToBoard.entity';
import { Repository } from 'typeorm';
import { CreateHashtagBoardRelationRequestDto } from './dto/CreateHashtagBoard.relation.request.dto';

@Injectable()
export class HashtagToBoardService {
  constructor(
    @InjectRepository(HashtagToBoard)
    private readonly hashtagToBoardRepository: Repository<HashtagToBoard>,
  ) {}

  async createHashtagToBoard(createHashtagBoardRelationRequestDto: CreateHashtagBoardRelationRequestDto) {
    const { board, hashtags } = createHashtagBoardRelationRequestDto;
    for (const hashtag of hashtags) {
      const newH2B = new HashtagToBoard();
      newH2B.hashtag = hashtag;
      newH2B.board = board;
      await this.hashtagToBoardRepository.save(newH2B);
    }
  }

  async findAll(): Promise<HashtagToBoard[]> {
    return await this.hashtagToBoardRepository.find();
  }
}
