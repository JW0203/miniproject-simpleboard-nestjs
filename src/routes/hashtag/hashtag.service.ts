import { Injectable } from '@nestjs/common';
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
    return this.hashtagRepository.save(createHashtagRequestDto);
  }

  async findOne(name: string): Promise<Hashtag> {
    return this.hashtagRepository.findOne({ where: { name: name } });
  }
}
