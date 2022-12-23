import { Module } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { PhotosController } from './photos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImageUrl } from 'src/entities';
import { PhotosDao } from './photos.dao';

@Module({
  imports: [TypeOrmModule.forFeature([ImageUrl])],
  controllers: [PhotosController],
  providers: [PhotosService, PhotosDao],
  exports: [PhotosService],
})
export class PhotosModule {}
