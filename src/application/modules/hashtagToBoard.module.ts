import { Module } from '@nestjs/common';
import { HashtagToBoardService } from '../services/hashtagToBoard.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HashtagToBoard } from '../../domain/entities/HashtagToBoard.entity';
import { HashtagToBoardController } from '../../presentation/controllers/hashtagToBoard.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HashtagToBoard])],
  providers: [HashtagToBoardService],
  controllers: [HashtagToBoardController],
  exports: [HashtagToBoardService],
})
export class HashtagToBoardModule {}
