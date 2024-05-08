import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Timestamps } from './Timestamp.entity';
import { Board } from './Board.entity';

@Entity()
export class Reply extends Timestamps {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  text: string;
  @ManyToOne(() => Board, (board) => board.replies)
  board: Board;

  constructor();
  constructor(params: { text: string; board });
  constructor(params?: { text: string; board }) {
    super();
    if (params) {
      this.text = params.text;
      this.board = params.board;
    }
  }
}
