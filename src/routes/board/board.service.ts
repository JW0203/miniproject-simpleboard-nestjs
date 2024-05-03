import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostRequestDto } from './dto/createPost.request.dto';

import { CategoryService } from '../category/category.service';
import { HashtagService } from '../hashtag/hashtag.service';
import { ReplyService } from '../reply/reply.service';
import { BoardToCategoryService } from '../board_category/boardToCategory.service';

import { CreateBoardCategoryRelationRequestDto } from '../board_category/dto/createBoardCategory.relation.request.dto';

import { CreateHashtagBoardRelationRequestDto, HashtagToBoardService } from '../hashtag_board/hashtagToBoard.index';
import { Hashtag, Board, Category } from '../../entities/entity.index';
import { Transactional } from 'typeorm-transactional';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UpdateRequestDto } from './dto/update.request.dto';

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
    const { title, content, categories, hashtags } = createPostRequestDto;
    const titleSpace = title.replaceAll(' ', '');
    if (!titleSpace) {
      throw new BadRequestException('The title should not be blank spaces');
    }

    const newPost = plainToClass(Board, { title, content });

    const postValidation = await validate(newPost);
    if (postValidation.length > 0) {
      throw new BadRequestException(`validation failed. errors: ${postValidation}`);
    }

    const post = await this.boardRepository.save(newPost);

    const categoryArray: Category[] = [];
    for (const category of categories) {
      const checkCategory: Category = await this.categoryService.findOne(category);
      if (checkCategory) {
        categoryArray.push(checkCategory);
      }
      if (!checkCategory) {
        throw new NotFoundException(`Could not find Category : ${checkCategory}`);
      }
    }

    const newB2C = new CreateBoardCategoryRelationRequestDto();
    newB2C.post = post;
    newB2C.categories = categoryArray;
    await this.boardToCategoryService.createRelation(newB2C);

    const hashtagArray: Hashtag[] = [];
    for (const hashtag of hashtags) {
      const checkHashtag = await this.hashtagService.findOne(hashtag);
      if (!checkHashtag) {
        const newHashtag = await this.hashtagService.create({ name: hashtag });
        hashtagArray.push(newHashtag);
      }
      if (checkHashtag) {
        hashtagArray.push(checkHashtag);
      }
    }

    const newH2P = new CreateHashtagBoardRelationRequestDto();
    newH2P.board = post;
    newH2P.hashtags = hashtagArray;
    await this.hashtagToBoardService.createHashtagToBoard(newH2P);

    return await this.findOne(post.id);
  }

  async findAll(): Promise<Board[]> {
    return await this.boardRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findBoardByCategory(name: string) {
    // 여러가지 카테고리 이름을 한번에 매칭 시키는 방법을 찾아야 할듯 -> In
    const foundCategory: Category = await this.categoryService.findOne(name);
    if (!foundCategory) {
      throw new NotFoundException(`Could not find category with name ${name}`);
    }
    const foundResult = await this.boardToCategoryService.findBoardByCategoryName(name);
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
    const foundHashtag: Hashtag = await this.hashtagService.findOne(name);
    if (!foundHashtag) {
      throw new NotFoundException(`Could not find hashtag with name ${name}`);
    }

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

  async findOne(id: number): Promise<Board> {
    const foundPost = this.boardRepository.findOne({
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

  async update(id: number, updateRequestDto: UpdateRequestDto): Promise<Board> {
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

    if (board.boardToCategories.length > 0) {
      const ids = board.boardToCategories.map((c) => c.id);
      await this.boardToCategoryService.deleteManyRelations(ids);
    }
    if (board.hashtagToBoards.length > 0) {
      const ids = board.hashtagToBoards.map((c) => c.id);
      await this.hashtagToBoardService.deleteRelation(ids);
    }
    if (board.replies) {
      const ids = board.replies.map((c) => c.id);
      await this.replyService.deleteReply(ids);
    }
    await this.boardRepository.softDelete(boardId);
  }
}
