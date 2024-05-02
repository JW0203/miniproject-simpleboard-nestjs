import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from '../../entities/Hashtag.entity';
import { Repository } from 'typeorm';
import { CreateHashtagRequestDto } from './dto/createHashtag.request.dto';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    public readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  async create(createHashtagRequestDto: CreateHashtagRequestDto) {
    const { name } = createHashtagRequestDto;
    await this.findOne(name);
    const newHashtag = new Hashtag();
    newHashtag.name = name;
    return this.hashtagRepository.save(newHashtag);
  }

  async findOne(name: string): Promise<Hashtag> {
    const foundHashtag = await this.hashtagRepository.findOne({ where: { name: name } });
    if (foundHashtag) {
      throw new BadRequestException(`Hashtag ${name} already exists`);
    }
    return foundHashtag;
  }
}
