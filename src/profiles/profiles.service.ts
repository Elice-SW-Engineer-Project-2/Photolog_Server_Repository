import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}
  async getProfile(userId: number): Promise<Profile> {
    return await this.profileRepository.findOne({ where: { userId } });
  }
  async changeProfileImage(userId: number, imageUrlId: number): Promise<any> {
    return await this.profileRepository
      .createQueryBuilder()
      .update(Profile)
      .set({ imageUrlId })
      .where('userId = :userId', { userId })
      .execute();
  }
}
