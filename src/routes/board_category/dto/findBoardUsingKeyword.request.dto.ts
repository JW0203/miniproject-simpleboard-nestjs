import { IsNotEmpty, IsString } from 'class-validator';

export class FindBoardUsingKeywordRequestDto {
  @IsNotEmpty()
  @IsString()
  keyword: string;
}
