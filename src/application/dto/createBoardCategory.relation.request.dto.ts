import { Board } from '../../domain/entities/Board.entity';
import { Category } from '../../domain/entities/Category.entity';

export class CreateBoardCategoryRelationRequestDto {
  post: Board;
  categories: Category[];
}
