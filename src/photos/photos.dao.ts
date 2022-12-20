import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Images, ImageUrl, Profile, Users } from 'src/entities';
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
