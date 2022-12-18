import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as entities from './entities';
import { PresignedUrlController } from './presignedURL/presigned-url.controller';
import { PresignedUrlModule } from './presignedURL/presigned-url.module';

import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

const inputEntities = [...Object.values(entities)];

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: inputEntities,
      synchronize: false,
      logging: true, // TODO : 배포시 false
    }),
    TypeOrmModule.forFeature(),
    UsersModule,
    PresignedUrlModule,
  ],
  controllers: [AppController, UsersController, PresignedUrlController],
  providers: [AppService],
})
export class AppModule {}
