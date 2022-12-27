import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile, Users, ImageUrl } from 'src/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    @InjectRepository(ImageUrl)
    private readonly ImageUrlRepository: Repository<ImageUrl>,

    private dataSource: DataSource,
  ) {}
  async getProfile(userId: number): Promise<Profile> {
    return await this.profileRepository.findOne({ where: { userId } });
  }
  // async changeProfileImage(userId: number): Promise<Profile> {
  //   await this.profileRepository.update()
  //   return image;
}
