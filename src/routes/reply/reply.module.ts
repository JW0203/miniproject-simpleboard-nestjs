import { Module } from '@nestjs/common';
import { ReplyController } from './reply.controller';
import { ReplyService } from './reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board, Reply } from '../../entities/entity.index';
// import { BoardModule } from '../board/board.module';

@Module({
  imports: [TypeOrmModule.forFeature([Reply]), TypeOrmModule.forFeature([Board])],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [ReplyService],
})
export class ReplyModule {}
