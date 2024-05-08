import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagModule } from '../hashtag/hashtag.module';
import { HashtagToBoardModule } from '../hashtag_board/hashtagToBoard.module';
import { CategoryModule } from '../category/category.module';
import { ReplyModule } from '../reply/reply.module';
import { BoardToCategoryService } from './boardToCategory.service';
import { BoardToCategory, Board } from '../../entities/entity.index';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    TypeOrmModule.forFeature([BoardToCategory]),
    CategoryModule,
    HashtagModule,
    HashtagToBoardModule,
    ReplyModule,
  ],
  controllers: [BoardController],
  providers: [BoardService, BoardToCategoryService],
  exports: [BoardService],
})
export class BoardModule {}
