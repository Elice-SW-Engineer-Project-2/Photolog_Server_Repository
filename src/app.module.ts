import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import * as entities from './entities';
import { PhotosController } from './photos/photos.controller';
import { PhotosModule } from './photos/photos.module';

import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { PostsController } from './posts/posts.controller';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { RedisCacheController } from './redis-cache/redis-cache.controller';

const inputEntities = [...Object.values(entities)];

@Module({
  imports: [
    CacheModule.register(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV == 'staging' ? '.env.staging' : '.env.dev',
    }),
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
    PhotosModule,
    PostsModule,
    AuthModule,
    RedisCacheModule,
  ],
  controllers: [
    AppController,
    UsersController,
    PhotosController,
    PostsController,
    AuthController,
    RedisCacheController,
  ],
  providers: [AppService],
})
export class AppModule {}
