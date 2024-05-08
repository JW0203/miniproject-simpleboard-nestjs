import { Module } from '@nestjs/common';
import { HashtagController } from '../../presentation/controllers/hashtag.controller';
import { HashtagService } from '../services/hashtag.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtag } from '../../domain/entities/Hashtag.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hashtag])],
  controllers: [HashtagController],
  providers: [HashtagService],
  exports: [HashtagService],
})
export class HashtagModule {}
