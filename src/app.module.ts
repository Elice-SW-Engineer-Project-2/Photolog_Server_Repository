import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  Cameras,
  Comments,
  Companies,
  Hashtags,
  Images,
  ImageUrl,
  Lenses,
  Likes,
  Posts,
  Profile,
  Tags,
  Users,
} from './entities';

import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';

// import * as Cameras, from './entities/Cameras';
// import * as Comments, from './entities/Comments';
// import * as Companies, from './entities/Companies';
// import * as Hashtags, from './entities/Hashtags';
// import * as Images, from './entities/Images';
// import * as ImageUrl, from './entities/ImageUrl';
// import * as Lenses, from './entities/Lenses';
// import * as Likes, from './entities/Likes';
// import * as Posts, from './entities/Posts';
// import * as Profile, from './entities/Profile';
// import * as Tags, from './entities/Tags';
// import * as Users, from './entities/Users';

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
      entities: [
        Users,
        Posts,
        Likes,
        Comments,
        Companies,
        Cameras,
        Lenses,
        Hashtags,
        Tags,
        Images,
        ImageUrl,
        Profile,
      ],
      // entities: ['./entities/*.ts'],
      synchronize: true,
      // autoLoadEntities: true,
      logging: true, // TODO : 배포시 false
    }),
    TypeOrmModule.forFeature(),
    UsersModule,
  ],
  controllers: [AppController, UsersController],
  providers: [AppService],
})
export class AppModule {}
