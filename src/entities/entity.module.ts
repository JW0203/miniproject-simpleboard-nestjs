import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from './Category.entity';
import { Board } from './Board.entity';
import { BoardToCategory } from './BoardToCategory.entity';
import { Hashtag } from './Hashtag.entity';
import { HashToBoard } from './HashToBoard.entity';
import { Reply } from './Reply.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Category]),
    TypeOrmModule.forFeature([Board]),
    TypeOrmModule.forFeature([BoardToCategory]),
    TypeOrmModule.forFeature([Hashtag]),
    TypeOrmModule.forFeature([HashToBoard]),
    TypeOrmModule.forFeature([Reply]),
  ],
})
export class EntityModule {}
