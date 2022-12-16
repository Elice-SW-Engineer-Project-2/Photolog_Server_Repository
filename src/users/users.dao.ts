import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Profile, Users } from 'src/entities';
import { DataSource, Repository } from 'typeorm';

import { UserSignUpDto } from './dto/user.signup.dto';

@Injectable()
export class UsersDao {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private dataSource: DataSource,
  ) {}

  async findByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByNickname(nickname: string): Promise<Profile> {
    return this.profileRepository.findOne({ where: { nickname } });
  }

  async saveUser(toSaveUser: UserSignUpDto): Promise<boolean> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const savedUser = await queryRunner.manager
        .getRepository(Users)
        .save({ email: toSaveUser.email, password: toSaveUser.password });
      await queryRunner.manager.getRepository(Profile).save({
        userId: savedUser.id,
        imageUrlId: null,
        nickname: toSaveUser.nickname,
      });
      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error);
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
