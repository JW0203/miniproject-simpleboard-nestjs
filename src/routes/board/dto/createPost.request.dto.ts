import { IsNotEmpty, Length } from 'class-validator';

export class CreatePostRequestDto {
  @IsNotEmpty()
  @Length(1, 15)
  title: string;

  @IsNotEmpty()
  @Length(1, 1000)
  content: string;
  categories: string[];
  hashtags: string[];
}
