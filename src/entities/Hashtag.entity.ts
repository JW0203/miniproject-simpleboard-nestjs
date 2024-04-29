import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Timestamps } from './Timestamp.entity';
import { HashToBoard } from './HashToBoard.entity';

@Entity()
export class Hashtag extends Timestamps {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => HashToBoard, (hashToBoard) => hashToBoard.hashtag)
  hashToBoards: HashToBoard[];
}
