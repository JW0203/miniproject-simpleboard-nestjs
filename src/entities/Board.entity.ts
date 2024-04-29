import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Timestamps } from './Timestamp.entity';
import { BoardToCategory } from './BoardToCategory.entity';
import { HashToBoard } from './HashToBoard.entity';
import { Reply } from './Reply.entity';

@Entity()
export class Board extends Timestamps {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  content: string;

  @OneToMany(() => BoardToCategory, (boardToCategory) => boardToCategory.board)
  public boardToCategories: BoardToCategory[];

  @OneToMany(() => HashToBoard, (hashToBoard) => hashToBoard.board)
  hashToBoards: HashToBoard[];

  @ManyToOne(() => Reply, (reply) => reply.board)
  replies: Reply[];
}
