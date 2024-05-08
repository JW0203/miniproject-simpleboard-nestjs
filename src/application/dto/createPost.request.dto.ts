import { IsNotEmpty, Length } from 'class-validator';

export class CreatePostRequestDto {
  @IsNotEmpty()
  @Length(5, 15)
  title: string;

  @IsNotEmpty()
  @Length(1, 1000)
  content: string;

  @IsNotEmpty()
  categoryIds: number[];

  @IsNotEmpty()
  hashtags: string[];
}
