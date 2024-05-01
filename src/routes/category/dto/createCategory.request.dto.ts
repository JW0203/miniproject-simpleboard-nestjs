interface categoryDto {
  name: string;
}
export class CreateCategoriesRequestDto {
  names: categoryDto[];
}
