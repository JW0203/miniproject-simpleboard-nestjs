import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './Board.entity';
import { Hashtag } from './Hashtag.entity';
import { Timestamps } from './Timestamp.entity';

@Entity()
export class HashToBoard extends Timestamps {
  @PrimaryGeneratedColumn()
  id: number;
  @ManyToOne(() => Board, (board) => board.hashToBoards)
  board: Board;
  @ManyToOne(() => Hashtag, (hashtag) => hashtag.hashToBoards)
  hashtag: Hashtag;
}
