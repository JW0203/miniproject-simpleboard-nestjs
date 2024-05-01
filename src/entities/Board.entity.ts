import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { Timestamps } from './Timestamp.entity';
import { BoardToCategory } from './BoardToCategory.entity';
import { HashtagToBoard } from './HashtagToBoard.entity';
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

  @OneToMany(() => HashtagToBoard, (hashtagToBoard) => hashtagToBoard.board)
  public hashtagToBoards: HashtagToBoard[];

  @ManyToOne(() => Reply, (reply) => reply.board)
  replies: Reply[];
}
