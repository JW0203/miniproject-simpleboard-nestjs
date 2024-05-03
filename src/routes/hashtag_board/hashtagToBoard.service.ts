import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HashtagToBoard } from '../../entities/HashtagToBoard.entity';
import { In, Repository } from 'typeorm';
import { CreateHashtagBoardRelationRequestDto } from './dto/CreateHashtagBoard.relation.request.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class HashtagToBoardService {
  constructor(
    @InjectRepository(HashtagToBoard)
    private readonly hashtagToBoardRepository: Repository<HashtagToBoard>,
  ) {}

  @Transactional()
  async createHashtagToBoard(createHashtagBoardRelationRequestDto: CreateHashtagBoardRelationRequestDto) {
    const { board, hashtags } = createHashtagBoardRelationRequestDto;
    for (const hashtag of hashtags) {
      const newH2B = new HashtagToBoard();
      newH2B.hashtag = hashtag;
      newH2B.board = board;
      await this.hashtagToBoardRepository.save(newH2B);
    }
  }

  async findAll(): Promise<HashtagToBoard[]> {
    return await this.hashtagToBoardRepository.find();
  }

  @Transactional()
  async deleteRelation(id: number) {
    const deleteInfo = await this.hashtagToBoardRepository.findOne({ where: { id } });

    if (!deleteInfo) {
      throw new NotFoundException(`Could not find the Hashtag To Board relation with id ${id}`);
    }
    await this.hashtagToBoardRepository.softRemove(deleteInfo);
  }

  @Transactional()
  async deleteManyRelation(ids: number[]) {
    const deleteInfos = await this.hashtagToBoardRepository.find({ where: { id: In(ids) } });
    await this.hashtagToBoardRepository.softRemove(deleteInfos);
    // for (const id of ids) {
    //   await this.deleteRelation(id);
    // }
  }

  async findBoardByHashtagName(name: string) {
    const foundResult = await this.hashtagToBoardRepository.find({
      relations: {
        hashtag: true,
        board: true,
      },
      where: {
        hashtag: { name },
      },
    });
    if (!foundResult) {
      throw new NotFoundException(`Could not find boards by using hashtag with name ${name}`);
    }
    return foundResult;
  }
}
