import { Board } from '../../domain/entities/Board.entity';
import { Hashtag } from '../../domain/entities/Hashtag.entity';

export class CreateHashtagBoardRelationRequestDto {
  board: Board;
  hashtags: Hashtag[];
}
