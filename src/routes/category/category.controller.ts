import { Body, Controller, Get, Post } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoriesRequestDto } from './dto/createCategory.request.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() createCategoriesRequestDto: CreateCategoriesRequestDto) {
    return this.categoryService.createCategories(createCategoriesRequestDto);
  }

  @Get()
  findAll() {
    return this.categoryService.findAll();
  }
}
