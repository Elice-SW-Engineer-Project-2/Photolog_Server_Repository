import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { errorMsg } from 'src/common/messages/error.messages';
import { UserSignUpDto } from './dto/user.signup.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { Profile, Users } from 'src/entities';

import * as bcrypt from 'bcrypt';
import { UserUpdateDto } from './dto/user.update.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(Profile)
    private readonly profileRepository: Repository<Profile>,
    private dataSource: DataSource,
  ) {}

  async findById(id: number): Promise<Users> {
    return this.usersRepository.findOne({ where: { id } });
  }
  async findByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { email } });
  }
  async findByNickname(nickname: string): Promise<Profile> {
    return this.profileRepository.findOne({ where: { nickname } });
  }

  async signUp(userSignupDto: UserSignUpDto): Promise<void> {
    const { email, password, nickname } = userSignupDto;

    const userByEmail = await this.findByEmail(email);
    if (userByEmail) {
      throw new BadRequestException(errorMsg.EMAIL_EXISTS);
    }

    const userByNickname = await this.findByNickname(nickname);
    if (userByNickname) {
      throw new BadRequestException(errorMsg.NICKNAME_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.PASSWORD_HASH_SALT),
    );

    const toSaveUser = {
      email,
      password: hashedPassword,
      nickname,
    };
    await this.saveUser(toSaveUser);
  }
  async saveUser(toSaveUser: UserSignUpDto): Promise<any> {
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
      return savedUser;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error);
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async updateUser(id: number, user: UserUpdateDto): Promise<void> {
    if (user.password) {
      const hashedPassword = await bcrypt.hash(
        user.password,
        parseInt(process.env.PASSWORD_HASH_SALT),
      );
      await this.usersRepository.update(id, {
        ...user,
        password: hashedPassword,
      });
    } else {
      await this.usersRepository.update(id, user);
    }
  }
  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.delete({ id });
  }
}
