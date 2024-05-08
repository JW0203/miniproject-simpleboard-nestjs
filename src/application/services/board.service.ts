import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import { CreatePostRequestDto } from '../dto/createPost.request.dto';
import { UpdateBoardRequestDto } from '../dto/updateBoard.request.dto';
import { CreateHashtagBoardRelationRequestDto } from '../dto/createHashtagBoard.relation.request.dto';
import { CreateBoardCategoryRelationRequestDto } from '../dto/createBoardCategory.relation.request.dto';

import { CategoryService } from './category.service';
import { HashtagService } from './hashtag.service';
import { ReplyService } from './reply.service';
import { BoardToCategoryService } from './boardToCategory.service';
import { HashtagToBoardService } from './hashtagToBoard.service';

import { Board } from '../../domain/entities/entity.index';

import { makeCategoryArray, deleteBoardRelations, makeHashtagArray } from '../functions';

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
  async create(createPostRequestDto: CreatePostRequestDto) {
    const { title, content, categoryIds, hashtags } = createPostRequestDto;
    console.log(title);
    const titleWithoutBlank = title.replaceAll(' ', '');
    if (!titleWithoutBlank) {
      throw new BadRequestException('The title should not be blank spaces');
    }

    const newBoard = new Board({ title, content });

    const [categoryPromiseResult, hashtagPromiseResult, board] = await Promise.all([
      makeCategoryArray(categoryIds, this.categoryService),
      makeHashtagArray(hashtags, this.hashtagService),
      await this.boardRepository.save(newBoard),
    ]);

    const newBoradToCategoryRelation = new CreateBoardCategoryRelationRequestDto({
      board,
      categoryArray: categoryPromiseResult,
    });

    if (hashtagPromiseResult.notCreatedHashtags.length > 0) {
      const noCreatedHashtags = hashtagPromiseResult.notCreatedHashtags.filter((hashtag) => hashtag.name);
      console.log(noCreatedHashtags);
      throw new Error(`${hashtagPromiseResult.notCreatedHashtags}`);
    }
    const newHashtagToBoardRelation = new CreateHashtagBoardRelationRequestDto({
      board,
      hashtagArray: hashtagPromiseResult.Hashtags,
    });

    await Promise.all([
      await this.boardToCategoryService.createRelation(newBoradToCategoryRelation),
      await this.hashtagToBoardService.createHashtagToBoard(newHashtagToBoardRelation),
    ]);

    const post = await this.findOne(board.id);
    const boardToCategoriesIds = post.boardToCategories.map((relation) => relation.id);
    const hashtagToBoardsIds = post.hashtagToBoards.map((relation) => relation.id);
    delete post.boardToCategories;
    delete post.hashtagToBoards;
    return {
      ...post,
      boardToCategoriesIds,
      hashtagToBoardsIds,
    };
  }

  async findAll(): Promise<Board[]> {
    return await this.boardRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findBoardByCategory(id: number) {
    await this.categoryService.findOne(id);

    const foundResult = await this.boardToCategoryService.findBoardByCategoryName(id);
    const posts = foundResult.map((post) => {
      const { id, name } = post.category;
      delete post.category;
      return {
        ...post,
        categoryId: id,
        categoryName: name,
      };
    });
    return posts;
  }

  async findBoardByHashtag(name: string) {
    const validKeyword = name.replaceAll(' ', '');
    if (validKeyword.length < 2) {
      throw new BadRequestException(` the keyword: ${name} is too short`);
    }

    await this.hashtagService.findOne(name);

    const result = await this.hashtagToBoardService.findBoardByHashtagName(name);
    const posts = result.map((post) => {
      const { id, name } = post.hashtag;
      delete post.hashtag;
      return {
        ...post,
        hashtagId: id,
        hashtagName: name,
      };
    });
    return posts;
  }

  async findOne(id: number) {
    const foundPost = await this.boardRepository.findOne({
      where: { id },
      relations: {
        boardToCategories: true,
        replies: true,
        hashtagToBoards: true,
      },
    });

    if (!foundPost) {
      throw new NotFoundException(`Could not find board by id : ${id}`);
    }

    return foundPost;
  }

  async update(id: number, updateRequestDto: UpdateBoardRequestDto): Promise<Board> {
    const existingPost = await this.boardRepository.findOne({ where: { id } });
    if (!existingPost) {
      throw new NotFoundException(`Could not find board with id ${id}`);
    }

    await this.boardRepository.update({ id: id }, updateRequestDto);
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
