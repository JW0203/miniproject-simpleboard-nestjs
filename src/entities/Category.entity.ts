import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Timestamps } from './Timestamp.entity';
import { BoardToCategory } from './BoardToCategory.entity';
import { IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class Category extends Timestamps {
  @PrimaryGeneratedColumn()
  id: number;

  @IsString()
  @IsNotEmpty()
  @Column()
  name: string;

  @OneToMany(() => BoardToCategory, (boardToCategory) => boardToCategory.category)
  public boardToCategories: BoardToCategory[];
}
