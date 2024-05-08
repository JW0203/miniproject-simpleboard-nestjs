import { Board } from '../../domain/entities/Board.entity';
import { Hashtag } from '../../domain/entities/Hashtag.entity';

export class CreateHashtagBoardRelationRequestDto {
  board: Board;
  hashtagArray: Hashtag[];

  constructor();
  constructor(params: { board: Board; hashtagArray: Hashtag[] });
  constructor(params?: { board: Board; hashtagArray: Hashtag[] }) {
    if (params) {
      this.board = params.board;
      this.hashtagArray = params.hashtagArray;
    }
  }
}
