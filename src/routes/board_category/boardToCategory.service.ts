import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateBoardCategoryRelationRequestDto } from './dto/createBoardCategory.relation.request.dto';
import { BoardToCategory } from '../../entities/BoardToCategory.entity';
import { HashtagToBoard } from '../../entities/HashtagToBoard.entity';

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

  async findBoardByCategoryName(name: string) {
    // 보기쉽게 정리 필요
    // 현재 아래와 같이 출력됨 -> category : id 와 name 만
    // boardToCategory ->   전부
    // {
    //   "createdAt": "2024-05-01T03:28:32.100Z",
    //   "updatedAt": "2024-05-01T03:28:32.100Z",
    //   "deletedAt": null,
    //   "id": 3,
    //   "category": {
    //   "createdAt": "2024-04-30T07:14:41.822Z",
    //     "updatedAt": "2024-04-30T07:14:41.822Z",
    //     "deletedAt": null,
    //     "id": 4,
    //     "name": "coding"
    // },
    //   "board": {
    //   "createdAt": "2024-05-01T03:28:32.073Z",
    //     "updatedAt": "2024-05-01T03:28:32.073Z",
    //     "deletedAt": null,
    //     "id": 1,
    //     "title": " test posting",
    //     "content": "category: zoo animal, hashtags"
    // }
    // },
    return this.boardToCategoryRepository.find({
      relations: { category: true, board: true },
      where: {
        category: {
          name: name,
        },
      },
    });
  }
}
