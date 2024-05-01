import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EntityModule } from './entities/entity.module';
import { CategoryModule } from './routes/category/category.module';
import { BoardModule } from './routes/board/board.module';
import { HashtagModule } from './routes/hashtag/hashtag.module';
import { BoardToCategoryModule } from './routes/board_category/boardToCategory.module';
import { HashtagToBoardModule } from './routes/hashtag_board/hashtagToBoard.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory() {
        return {
          type: 'mysql',
          host: 'localhost',
          port: 3306,
          username: 'root',
          password: '',
          database: 'typeorm_board',
          autoLoadEntities: true,
          synchronize: true,
          logging: true,
          namingStrategy: new SnakeNamingStrategy(),
        };
      },
      async dataSourceFactory(options) {
        if (!options) {
          throw new Error('Invalid options passed');
        }

        return addTransactionalDataSource(new DataSource(options));
      },
    }),

    EntityModule,
    CategoryModule,
    HashtagModule,
    BoardToCategoryModule,
    BoardModule,
    HashtagToBoardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
