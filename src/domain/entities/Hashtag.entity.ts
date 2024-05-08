import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Timestamps } from './Timestamp.entity';
import { HashtagToBoard } from './HashtagToBoard.entity';

@Entity()
export class Hashtag extends Timestamps {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @OneToMany(() => HashtagToBoard, (hashtagToBoard) => hashtagToBoard.hashtag)
  public hashtagToBoards: HashtagToBoard[];

  constructor();
  constructor(params: { name: string });
  constructor(params?: { name: string }) {
    super();
    if (params) {
      this.name = params.name;
    }
  }
}
