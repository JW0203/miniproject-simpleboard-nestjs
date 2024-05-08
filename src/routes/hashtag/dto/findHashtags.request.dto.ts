import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class FindHashtagsRequestDto {
  @IsArray()
  @IsNotEmpty()
  @IsString({ each: true })
  names: string[];

  constructor(names: string[]) {
    this.names = names;
  }
}
