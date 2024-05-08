import { Board } from '../../domain/entities/Board.entity';
import { Category } from '../../domain/entities/Category.entity';

export class CreateBoardCategoryRelationRequestDto {
  board: Board;
  categoryArray: Category[];
  constructor();
  constructor(params: { board: Board; categoryArray: Category[] });
  constructor(params?: { board: Board; categoryArray: Category[] }) {
    if (params) {
      this.board = params.board;
      this.categoryArray = params.categoryArray;
    }
  }
}
