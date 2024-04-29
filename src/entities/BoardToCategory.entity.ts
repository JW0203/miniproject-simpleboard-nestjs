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
}
