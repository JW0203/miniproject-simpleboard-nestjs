export class CreateCategoryResponseDto {
  categoryId: number;
  categoryName: string;

  constructor();
  constructor(params: { id: number; name: string });
  constructor(params?: { id: number; name: string }) {
    if (params) {
      this.categoryId = params.id;
      this.categoryName = params.name;
    }
  }
}
