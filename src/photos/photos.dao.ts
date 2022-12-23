import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ImageUrl } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class PhotosDao {
  constructor(
    @InjectRepository(ImageUrl)
    private readonly imageUrlRepository: Repository<ImageUrl>,
  ) {}

  async uploadPhotoUrl(url: string) {
    return await this.imageUrlRepository.save({ url });
  }
}
