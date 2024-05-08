import { Module } from '@nestjs/common';
import { BoardController } from '../../presentation/controllers/board.controller';
import { BoardService } from '../services/board.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagModule } from './hashtag.module';
import { HashtagToBoardModule } from './hashtagToBoard.module';
import { CategoryModule } from './category.module';
import { ReplyModule } from './reply.module';
import { BoardToCategoryService } from '../services/boardToCategory.service';
import { BoardToCategory, Board } from '../../domain/entities/entity.index';

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
