import { CategoryService } from '../services/category.service';
import { Category } from '../../domain/entities/Category.entity';
import { NotFoundException } from '@nestjs/common';

export async function makeCategoryArray(
  categoryIds: number[],
  categoryService: CategoryService,
): Promise<Array<Category>> {
  const categoryArray: Category[] = await categoryService.findCategories(categoryIds);
  for (const i in categoryArray) {
    if (categoryArray[i] === null) {
      throw new NotFoundException(`Could not find Category using id: ${categoryIds[i]}`);
    }
  }
  return categoryArray;
}
