import { Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Board } from './Board.entity';
import { Category } from './Category.entity';
import { Timestamps } from './Timestamp.entity';

@Entity()
export class BoardToCategory extends Timestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Board, (board) => board.id)
  board: Board;
  @ManyToOne(() => Category, (category) => category.id)
  category: Category;

  constructor();
  constructor(params: { board: Board; category: Category });
  constructor(params?: { board: Board; category: Category }) {
    super();
    if (params) {
      this.board = params.board;
      this.category = params.category;
    }
  }
}
