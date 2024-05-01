import { Module } from '@nestjs/common';
import { BoardController } from './board.controller';
import { BoardService } from './board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from '../../entities/Board.entity';
import { HashtagModule } from '../hashtag/hashtag.module';
import { HashtagToBoardModule } from '../hashtag_board/hashtagToBoard.module';
import { BoardToCategoryModule } from '../board_category/boardToCategory.module';
import { CategoryModule } from '../category/category.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    CategoryModule,
    HashtagModule,
    BoardToCategoryModule,
    HashtagToBoardModule,
  ],
  controllers: [BoardController],
  providers: [BoardService],
  exports: [BoardService],
})
export class BoardModule {}
