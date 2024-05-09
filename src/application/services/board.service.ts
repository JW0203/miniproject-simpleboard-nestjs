import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CreateBoardRequestDto } from '../dto/createBoard.request.dto';
import { UpdateBoardRequestDto } from '../dto/updateBoard.request.dto';
import { CreateHashtagBoardRelationRequestDto } from '../dto/createHashtagBoard.relation.request.dto';
import { CreateBoardCategoryRelationRequestDto } from '../dto/createBoardCategory.relation.request.dto';

import { CategoryService } from './category.service';
import { HashtagService } from './hashtag.service';
import { ReplyService } from './reply.service';
import { BoardToCategoryService } from './boardToCategory.service';
import { HashtagToBoardService } from './hashtagToBoard.service';

import { Board } from '../../domain/entities/entity.index';

import { deleteBoardRelations, makeHashtagArrayByName } from '../functions';

@Injectable()
export class BoardService {
  constructor(
    private readonly hashtagService: HashtagService,
    private readonly categoryService: CategoryService,
    private readonly boardToCategoryService: BoardToCategoryService,
    private readonly hashtagToBoardService: HashtagToBoardService,
    private readonly replyService: ReplyService,
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  @Transactional()
  async create(createBoardRequestDto: CreateBoardRequestDto) {
    try {
      const { title, content, categoryIds, hashtags } = createBoardRequestDto;

      const titleWithoutBlank = title.replaceAll(' ', '');
      if (!titleWithoutBlank) {
        throw new BadRequestException('The title should not be blank spaces');
      }

      const newBoard = new Board({ title, content });

      const [categoryPromiseResult, hashtagPromiseResult, board] = await Promise.all([
        // makeCategoryArrayByIds(categoryIds, this.categoryService),
        await this.categoryService.findCategories(categoryIds),
        makeHashtagArrayByName(hashtags, this.hashtagService),
        await this.boardRepository.save(newBoard),
      ]);

      for (const i in categoryPromiseResult) {
        if (categoryPromiseResult[i] === null) {
          throw new NotFoundException(`Could not find Category using id: ${categoryIds[i]}`);
        }
      }

      // if (hashtagPromiseResult.notCreatedHashtags.length > 0) {
      //   const noCreatedHashtags = hashtagPromiseResult.notCreatedHashtags.filter((hashtag) => hashtag.name);
      //   console.log(noCreatedHashtags);
      //   throw new Error(`${hashtagPromiseResult.notCreatedHashtags}`);
      // }

      const newBoardToCategoryRelation = new CreateBoardCategoryRelationRequestDto({
        board,
        categoryArray: categoryPromiseResult,
      });

      const newHashtagToBoardRelation = new CreateHashtagBoardRelationRequestDto({
        board,
        hashtagArray: hashtagPromiseResult.Hashtags,
      });

      await Promise.all([
        await this.boardToCategoryService.createRelation(newBoardToCategoryRelation),
        await this.hashtagToBoardService.createHashtagToBoard(newHashtagToBoardRelation),
      ]);

      const foundNewBoard = await this.findOne(board.id);
      const boardToCategoriesIds = foundNewBoard.boardToCategories.map((relation) => relation.id);
      const hashtagToBoardsIds = foundNewBoard.hashtagToBoards.map((relation) => relation.id);
      delete foundNewBoard.boardToCategories;
      delete foundNewBoard.hashtagToBoards;
      return {
        ...foundNewBoard,
        boardToCategoriesIds,
        hashtagToBoardsIds,
      };
    } catch (error) {
      return error;
    }
  }

  async findAll(): Promise<Board[]> {
    return await this.boardRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findBoardByCategory(id: number) {
    await this.categoryService.findOne(id);

    const foundResult = await this.boardToCategoryService.findBoardByCategoryName(id);
    return foundResult.map((board) => {
      const { id, name } = board.category;
      delete board.category;
      return {
        ...board,
        categoryId: id,
        categoryName: name,
      };
    });
  }

  async findBoardByHashtag(name: string) {
    const validKeyword = name.replaceAll(' ', '');
    if (validKeyword.length < 2) {
      throw new BadRequestException(` the keyword: ${name} is too short`);
    }

    await this.hashtagService.findOne(name);

    const result = await this.hashtagToBoardService.findBoardByHashtagName(name);
    return result.map((post) => {
      const { id, name } = post.hashtag;
      delete post.hashtag;
      return {
        ...post,
        hashtagId: id,
        hashtagName: name,
      };
    });
  }

  async findOne(id: number) {
    const foundBoard = await this.boardRepository.findOne({
      where: { id },
      relations: {
        boardToCategories: true,
        replies: true,
        hashtagToBoards: true,
      },
    });

    if (!foundBoard) {
      throw new NotFoundException(`Could not find board by id : ${id}`);
    }

    return foundBoard;
  }

  async update(id: number, updateBoardRequestDto: UpdateBoardRequestDto): Promise<Board> {
    const existingBoard = await this.boardRepository.findOne({ where: { id } });
    if (!existingBoard) {
      throw new NotFoundException(`Could not find board with id ${id}`);
    }

    await this.boardRepository.update({ id: id }, updateBoardRequestDto);
    return this.boardRepository.findOne({ where: { id } });
  }

  @Transactional()
  async deleteBoard(boardId: number) {
    const board = await this.findOne(boardId);
    if (!board) {
      throw new NotFoundException(`Could not find board with id ${boardId}`);
    }

    const iterableInputs = deleteBoardRelations({
      board,
      boardToCategoryService: this.boardToCategoryService,
      hashtagToBoardService: this.hashtagToBoardService,
      replyService: this.replyService,
    });

    await Promise.all(iterableInputs);
    await this.boardRepository.softDelete(boardId);
  }
}
