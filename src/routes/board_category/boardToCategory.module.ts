import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardToCategoryService } from './boardToCategory.service';
import { BoardToCategory } from '../../entities/BoardToCategory.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoardToCategory])],
  providers: [BoardToCategoryService],
  exports: [BoardToCategoryService],
})
export class BoardToCategoryModule {}
