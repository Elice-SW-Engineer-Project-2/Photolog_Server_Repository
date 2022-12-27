import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile } from 'src/entities';
import { Repository } from 'typeorm';
@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
  ) {}

  async getProfile(userId: number): Promise<any> {
    const foundUser = await this.profileRepository
      .createQueryBuilder('profile')
      .select(['user.email', 'profile.nickname', 'image.url'])
      .leftJoin('profile.user', 'user')
      .leftJoin('profile.image', 'image')
      .where('profile.userId=:userId', { userId })
      .execute();

    return foundUser;
  }
  async changeProfileImage(userId: number, imageUrlId: number): Promise<any> {
    try {
      await this.profileRepository
        .createQueryBuilder()
        .update(Profile)
        .set({ imageUrlId })
        .where('userId = :userId', { userId })
        .execute();
    } catch (err) {
      console.log(err);
      throw new ForbiddenException('이미지 변경이 불가능합니다.');
    }
  }
}
