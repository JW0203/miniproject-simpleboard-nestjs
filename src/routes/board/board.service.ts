import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { DataSource } from 'typeorm';
import { CreatePostRequestDto } from './dto/createPost.request.dto';
import { CategoryService } from '../category/category.service';
import { HashtagService } from '../hashtag/hashtag.service';

import { BoardToCategoryService } from '../board_category/boardToCategory.service';
import { CreateBoardCategoryRelationRequestDto } from '../board_category/dto/createBoardCategory.relation.request.dto';

import { CreateHashtagBoardRelationRequestDto, HashtagToBoardService } from '../hashtag_board/hashtagToBoard.index';
import { Hashtag, Board, Category, HashtagToBoard } from '../../entities/entity.index';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class BoardService {
  constructor(
    private readonly hashtagService: HashtagService,
    private readonly categoryService: CategoryService,
    private readonly boardToCategoryService: BoardToCategoryService,
    private readonly hashtagToBoardService: HashtagToBoardService,
    // private readonly dataSource: DataSource,
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

    // category가 여러개임
    const categoryArray: Category[] = [];
    for (const category of categories) {
      const checkCategory: Category = await this.categoryService.findOne(category);
      if (checkCategory) {
        categoryArray.push(checkCategory);
      }
      if (!checkCategory) {
        // 이 에러를 만들면 아마 transaction 이 안될거다
        // transaction 을  적용해서 rollback 이 되도록 만들자.
        throw new Error('Category not found');
      }
    }

    //  post 와  category 연결
    const newB2C = new CreateBoardCategoryRelationRequestDto();
    newB2C.post = post;
    newB2C.categories = categoryArray;
    await this.boardToCategoryService.createRelation(newB2C);

    // 여기서 할 것이 아니라 외부에서 해야 할 것 같은데... 함수를 만들까?
    // hashtagFindAndCreate 로 함수 만들고 return 을 hashtagArray 로 만들자
    // 하나의 기능을 해야하는데 찾고 만든다??
    // 1. hashtagFinder => return hashtagArray, newHashtags 이렇게 두개 반환
    // 2. newHashtags 가지고 새로운 해쉬태그 생성 하고 hashtagArray에 저장

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
    // 여러가지 카테고리 이름을 한번에 매칭 시키는 방법을 찾아야 할듯
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
    // return await this.boardToCategoryService.findBoardByCategoryName(name);
  }
}
