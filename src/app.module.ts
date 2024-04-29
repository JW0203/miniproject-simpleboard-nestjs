import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { EntityModule } from './entities/entity.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
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
    }),
    EntityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
