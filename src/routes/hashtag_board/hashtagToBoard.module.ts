import { Module } from '@nestjs/common';
import { HashtagToBoardService } from './hashtagToBoard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagToBoard } from '../../entities/HashtagToBoard.entity';
import { HashtagToBoardController } from './hashtagToBoard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HashtagToBoard])],
  providers: [HashtagToBoardService],
  controllers: [HashtagToBoardController],
  exports: [HashtagToBoardService],
})
export class HashtagToBoardModule {}
