import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import { CategoryService } from '../../application/services/category.service';
import { CreateCategoriesRequestDto } from '../../application/dto/createCategories.request.dto';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createCategoriesRequestDto: CreateCategoriesRequestDto) {
    return this.categoryService.createCategories(createCategoriesRequestDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }
}
