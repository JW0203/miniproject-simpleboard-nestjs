import { BadRequestException, Injectable } from '@nestjs/common';
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
    for (const name of names) {
      console.log(name);
      const existingCategory = await this.categoryRepository.findOne({ where: { name } });

      if (existingCategory) {
        throw new BadRequestException(`Category name ${name} is already exist`);
      }

      const newCategory: Category = await this.categoryRepository.save({ name });
      savedCategories.push(new CreateCategoryResponseDto(newCategory.id, newCategory.name));
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

  async findOne(id: number): Promise<Category> {
    return await this.categoryRepository.findOne({ where: { id } });
  }

  async findCategories(ids: number[]): Promise<Category[]> {
    const categoryList: Category[] = [];
    await Promise.allSettled(ids.map((id) => this.findOne(id))).then((results) => {
      results.forEach((result) => {
        categoryList.push(result['value']);
      });
    });
    return categoryList;
  }
}
