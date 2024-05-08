import { Board } from '../../../entities/Board.entity';
import { BoardToCategoryService } from '../../board_category/boardToCategory.service';
import { HashtagToBoardService } from '../../hashtag_board/hashtagToBoard.service';
import { ReplyService } from '../../reply/reply.service';

interface DeleteBoardRelationsParams {
  board: any; // Board 타입을 사용하는 것이 좋습니다.
  boardToCategoryService: BoardToCategoryService;
  hashtagToBoardService: HashtagToBoardService;
  replyService: ReplyService;
}

export function deleteBoardRelations(inputs: DeleteBoardRelationsParams) {
  const { board, boardToCategoryService, hashtagToBoardService, replyService } = inputs;
  const iterableInputs: Promise<void>[] = [];
  if (board.boardToCategories.length > 0) {
    const ids = board.boardToCategories.map((c) => c.id);
    iterableInputs.push(boardToCategoryService.deleteManyRelations(ids));
  }
  if (board.hashtagToBoards.length > 0) {
    const ids = board.hashtagToBoards.map((c) => c.id);
    iterableInputs.push(hashtagToBoardService.deleteManyRelation(ids));
  }
  if (board.replies) {
    const ids = board.replies.map((c) => c.id);
    iterableInputs.push(replyService.deleteReply(ids));
  }
  return iterableInputs;
}
