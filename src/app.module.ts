import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EntityModule } from './domain/entities/entity.module';
import { CategoryModule } from './application/modules/category.module';
import { BoardModule } from './application/modules/board.module';
import { HashtagModule } from './application/modules/hashtag.module';
import { HashtagToBoardModule } from './application/modules/hashtagToBoard.module';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { DataSource } from 'typeorm';
import { ReplyModule } from './application/modules/reply.module';

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
    BoardModule,
    HashtagToBoardModule,
    ReplyModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
