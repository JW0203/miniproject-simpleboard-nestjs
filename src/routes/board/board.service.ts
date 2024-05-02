import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostRequestDto } from './dto/createPost.request.dto';

import { CategoryService } from '../category/category.service';
import { HashtagService } from '../hashtag/hashtag.service';
import { ReplyService } from '../reply/reply.service';
import { BoardToCategoryService } from '../board_category/boardToCategory.service';

import { CreateBoardCategoryRelationRequestDto } from '../board_category/dto/createBoardCategory.relation.request.dto';

import { CreateHashtagBoardRelationRequestDto, HashtagToBoardService } from '../hashtag_board/hashtagToBoard.index';
import { Hashtag, Board, Category, Reply } from '../../entities/entity.index';
import { Transactional } from 'typeorm-transactional';

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
    const newPost = new Board();
    newPost.title = title;
    newPost.content = content;
    const post = await this.boardRepository.save(newPost);

    const categoryArray: Category[] = [];
    for (const category of categories) {
      const checkCategory: Category = await this.categoryService.findOne(category);
      if (checkCategory) {
        categoryArray.push(checkCategory);
      }
      if (!checkCategory) {
        throw new Error('Category not found');
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
  }

  // async createTransaction(createPostRequestDto: CreatePostRequestDto) {
  //   const queryRunner = this.dataSource.createQueryRunner();
  //   await queryRunner.connect();
  //   await queryRunner.startTransaction();
  //
  //   try {
  //     const { title, content, categories, hashtags } = createPostRequestDto;
  //     const newPost = new Board();
  //     newPost.title = title;
  //     newPost.content = content;
  //     const post = await queryRunner.manager.save(await this.boardRepository.save(newPost));
  //
  //     const categoryArray: Category[] = [];
  //     for (const category of categories) {
  //       const checkCategory: Category = await this.categoryService.findOne(category);
  //       if (checkCategory) {
  //         categoryArray.push(checkCategory);
  //       }
  //       if (!checkCategory) {
  //         throw new Error('Category not found');
  //       }
  //     }
  //     const newB2C = new CreateBoardCategoryRelationRequestDto();
  //     newB2C.post = post;
  //     newB2C.categories = categoryArray;
  //     await queryRunner.manager.save(await this.boardToCategoryService.createRelation(newB2C));
  //
  //     const hashtagArray: Hashtag[] = [];
  //     for (const hashtag of hashtags) {
  //       const checkHashtag = await this.hashtagService.findOne(hashtag);
  //       if (!checkHashtag) {
  //         const newHashtag = await this.hashtagService.create({ name: hashtag });
  //         hashtagArray.push(newHashtag);
  //       }
  //       if (checkHashtag) {
  //         hashtagArray.push(checkHashtag);
  //       }
  //     }
  //
  //     const newH2P = new CreateHashtagBoardRelationRequestDto();
  //     newH2P.board = post;
  //     newH2P.hashtags = hashtagArray;
  //     await queryRunner.manager.save(await this.hashtagToBoardService.createHashtagToBoard(newH2P));
  //
  //     await queryRunner.commitTransaction();
  //   } catch (error) {
  //     await queryRunner.rollbackTransaction();
  //   } finally {
  //     await queryRunner.release();
  //   }
  // }

  async findAll(): Promise<Board[]> {
    return await this.boardRepository.find({ order: { createdAt: 'DESC' } });
  }

  async findBoardByCategory(name: string) {
    // 여러가지 카테고리 이름을 한번에 매칭 시키는 방법을 찾아야 할듯 -> In
    console.log(`name: ${name}`);
    const categories: Category[] = await this.categoryService.findCategories(name);
    console.log(categories);
    const result = await this.boardToCategoryService.findBoardByCategoryName(name);
    const posts = result.map((post) => {
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
    console.log(`name: ${name}`);
    const hashtag: Hashtag = await this.hashtagService.findOne(name);
    console.log(hashtag);
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
    return this.boardRepository.findOne({
      where: { id },
      relations: {
        boardToCategories: true,
        replies: true,
        hashtagToBoards: true,
      },
    });
  }

  async update(id: number, updateRequest: object): Promise<Board> {
    await this.boardRepository.update({ id: id }, updateRequest);
    return this.boardRepository.findOne({ where: { id } });
  }

  @Transactional()
  async deleteBoard(boardId: number) {
    const board = await this.boardRepository.findOne({
      where: { id: boardId },
      relations: {
        boardToCategories: true,
        replies: true,
        hashtagToBoards: true,
      },
    });
    if (board.boardToCategories.length > 0) {
      const ids = board.boardToCategories.map((c) => c.id);
      await this.boardToCategoryService.deleteRelation(ids);
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
