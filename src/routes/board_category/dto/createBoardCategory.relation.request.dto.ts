import { Board } from '../../../entities/Board.entity';
import { Category } from '../../../entities/Category.entity';

export class CreateBoardCategoryRelationRequestDto {
  post: Board;
  categories: Category[];
}
