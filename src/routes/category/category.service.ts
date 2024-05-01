import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCategoriesRequestDto } from './dto/createCategory.request.dto';
import { Category } from '../../entities/Category.entity';
import { CreateCategoryResponseDto } from './dto/createCategory.response.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async createCategories(createCategoriesRequestDto: CreateCategoriesRequestDto): Promise<Category[]> {
    const { names } = createCategoriesRequestDto;
    const savedCategories = [];
    for (const category of names) {
      const existingCategory = await this.categoryRepository.findOne({ where: { name: category.name } });
      if (!existingCategory) {
        savedCategories.push(category.name);
        const newCategory: Category = await this.categoryRepository.save(category);
        savedCategories.push(new CreateCategoryResponseDto(newCategory.id, newCategory.name));
      }
      if (existingCategory) {
        console.log(`-- "${category.name}" already exists`);
      }
    }
    return savedCategories;
  }

  async findAll(): Promise<Category[]> {
    const allCategories = await this.categoryRepository.find();
    const response = [];
    for (const category of allCategories) {
      response.push(new CreateCategoryResponseDto(category.id, category.name));
    }
    return response;
  }

  async findOne(name: string): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { name } });
  }
}
