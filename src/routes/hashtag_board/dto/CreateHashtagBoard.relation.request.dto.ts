import { Board } from '../../../entities/Board.entity';
import { Hashtag } from '../../../entities/Hashtag.entity';

export class CreateHashtagBoardRelationRequestDto {
  board: Board;
  hashtags: Hashtag[];
}
