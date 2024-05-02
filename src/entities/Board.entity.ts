import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Timestamps } from './Timestamp.entity';
import { BoardToCategory } from './BoardToCategory.entity';
import { HashtagToBoard } from './HashtagToBoard.entity';
import { Reply } from './Reply.entity';
import { IsNotEmpty, IsString, Length } from 'class-validator';

@Entity()
export class Board extends Timestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Length(10, 20)
  @Column()
  title: string;

  @IsString()
  @IsNotEmpty()
  @Column()
  content: string;

  @OneToMany(() => BoardToCategory, (boardToCategory) => boardToCategory.board)
  public boardToCategories: BoardToCategory[];

  @OneToMany(() => HashtagToBoard, (hashtagToBoard) => hashtagToBoard.board)
  public hashtagToBoards: HashtagToBoard[];

  @OneToMany(() => Reply, (reply) => reply.board)
  replies: Reply[];
}
