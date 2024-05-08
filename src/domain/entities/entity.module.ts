import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './Category.entity';
import { Board } from './Board.entity';
import { BoardToCategory } from './BoardToCategory.entity';
import { Hashtag } from './Hashtag.entity';
import { HashtagToBoard } from './HashtagToBoard.entity';
import { Reply } from './Reply.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Board]),
    TypeOrmModule.forFeature([BoardToCategory]),
    TypeOrmModule.forFeature([Hashtag]),
    TypeOrmModule.forFeature([HashtagToBoard]),
    TypeOrmModule.forFeature([Reply]),
  ],
})
export class EntityModule {}
