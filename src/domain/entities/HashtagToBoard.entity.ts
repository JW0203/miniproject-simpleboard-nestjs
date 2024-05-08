import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './Board.entity';
import { Hashtag } from './Hashtag.entity';
import { Timestamps } from './Timestamp.entity';

@Entity()
export class HashtagToBoard extends Timestamps {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Board, (board) => board.id)
  board: Board;
  @ManyToOne(() => Hashtag, (hashtag) => hashtag.id)
  hashtag: Hashtag;

  constructor();
  constructor(params: { board: Board; hashtag: Hashtag });
  constructor(params?: { board: Board; hashtag: Hashtag }) {
    super();
    if (params) {
      this.board = params.board;
      this.hashtag = params.hashtag;
    }
  }
}
