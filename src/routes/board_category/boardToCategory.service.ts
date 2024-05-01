import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBoardCategoryRelationRequestDto } from './dto/createBoardCategory.relation.request.dto';
import { BoardToCategory } from '../../entities/BoardToCategory.entity';

@Injectable()
export class BoardToCategoryService {
  constructor(
    @InjectRepository(BoardToCategory)
    private readonly boardToCategoryRepository: Repository<BoardToCategory>,
  ) {}

  async createRelation(createBoardCategoryRelationRequestDto: CreateBoardCategoryRelationRequestDto) {
    const { post, categories } = createBoardCategoryRelationRequestDto;
    for (const category of categories) {
      const newB2C = new BoardToCategory();
      newB2C.category = category;
      newB2C.board = post;
      await this.boardToCategoryRepository.save(newB2C);
    }
  }
}
