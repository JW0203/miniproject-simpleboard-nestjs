import { Module } from '@nestjs/common';
import { CategoryController } from '../../presentation/controllers/category.controller';
import { CategoryService } from '../services/category.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from '../../domain/entities/Category.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController],
  providers: [CategoryService],
  exports: [CategoryService],
})
export class CategoryModule {}
