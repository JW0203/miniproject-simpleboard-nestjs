import { IsOptional, Length } from 'class-validator';

export class UpdateRequestDto {
  @IsOptional()
  @Length(1, 15)
  title?: string;

  @IsOptional()
  @Length(1, 1000)
  content?: string;

  @IsOptional()
  categories?: string[];

  @IsOptional()
  hashtags?: string[];
}
