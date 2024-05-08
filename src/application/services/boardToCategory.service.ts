import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { CreateBoardCategoryRelationRequestDto } from '../dto/createBoardCategory.relation.request.dto';
import { BoardToCategory } from '../../domain/entities/BoardToCategory.entity';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class BoardToCategoryService {
  constructor(
    @InjectRepository(BoardToCategory)
    private readonly boardToCategoryRepository: Repository<BoardToCategory>,
  ) {}
  @Transactional()
  async createRelation(createBoardCategoryRelationRequestDto: CreateBoardCategoryRelationRequestDto) {
    const { post, categories } = createBoardCategoryRelationRequestDto;
    for (const category of categories) {
      const newB2C = new BoardToCategory();
      newB2C.category = category;
      newB2C.board = post;
      await this.boardToCategoryRepository.save(newB2C);
    }
  }

  async findBoardByCategoryName(id: number) {
    const foundResult = await this.boardToCategoryRepository.find({
      relations: { category: true, board: true },
      where: {
        category: {
          id,
        },
      },
    });
    if (!foundResult) {
      throw new NotFoundException(`Could not find boards by using category with id ${id}`);
    }
    return foundResult;
  }

  @Transactional()
  async deleteRelation(id: number) {
    const foundResult = await this.boardToCategoryRepository.findOne({ where: { id } });
    if (!foundResult) {
      throw new NotFoundException(`Could not find "Board To Category relation" with id ${id}`);
    }
    await this.boardToCategoryRepository.softRemove(foundResult);
  }

  @Transactional()
  async deleteManyRelations(ids: number[]): Promise<void> {
    const deleteInfo = await this.boardToCategoryRepository.find({ where: { id: In(ids) } });
    await this.boardToCategoryRepository.softRemove(deleteInfo);
  }
}
