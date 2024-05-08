import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Hashtag } from '../../domain/entities/Hashtag.entity';
import { Repository } from 'typeorm';
import { CreateHashtagRequestDto } from '../dto/createHashtag.request.dto';

@Injectable()
export class HashtagService {
  constructor(
    @InjectRepository(Hashtag)
    public readonly hashtagRepository: Repository<Hashtag>,
  ) {}

  async create(createHashtagRequestDto: CreateHashtagRequestDto) {
    const { name } = createHashtagRequestDto;
    await this.findOne(name);
    const newHashtag = new Hashtag({ name });
    // newHashtag.name = name;
    return this.hashtagRepository.save(newHashtag);
  }

  async findOne(name: string): Promise<Hashtag> {
    return await this.hashtagRepository.findOne({ where: { name: name } });
  }

  async findHashtags(names: string[]): Promise<Hashtag[]> {
    const hashtagList: Hashtag[] = [];
    await Promise.allSettled(names.map((name) => this.findOne(name))).then((results) => {
      results.forEach((result) => {
        hashtagList.push(result['value']);
      });
    });

    return hashtagList;
  }
}
