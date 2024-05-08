import { Module } from '@nestjs/common';
import { ReplyController } from '../../presentation/controllers/reply.controller';
import { ReplyService } from '../services/reply.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board, Reply } from '../../domain/entities/entity.index';

@Module({
  imports: [TypeOrmModule.forFeature([Reply]), TypeOrmModule.forFeature([Board])],
  controllers: [ReplyController],
  providers: [ReplyService],
  exports: [ReplyService],
})
export class ReplyModule {}
