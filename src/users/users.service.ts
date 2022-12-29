import {
  BadRequestException,
  Injectable,
  Logger,
  UseGuards,
} from '@nestjs/common';
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
    return await this.usersRepository.findOne({ where: { id } });
  }
  async findByEmail(email: string): Promise<Users> {
    return await this.usersRepository.findOne({ where: { email } });
  }
  async findByNickname(nickname: string): Promise<Profile> {
    return await this.profileRepository.findOne({ where: { nickname } });
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

    try {
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
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
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

  async updateUserPassword(id: number, user: UserUpdateDto): Promise<void> {
    const hashedPassword = await bcrypt.hash(
      user.password,
      parseInt(process.env.PASSWORD_HASH_SALT),
    );
    try {
      await this.usersRepository.update(id, {
        password: hashedPassword,
      });
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async updateNickname(user: Users, nickname: string) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const id = user.id;
      await queryRunner.manager
        .createQueryBuilder()
        .update(Profile)
        .set({ nickname })
        .where('userId = :id', { id })
        .execute();
      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error);
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  @UseGuards()
  async deleteUser(uid: number): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      await this.usersRepository
        .createQueryBuilder()
        .softDelete()
        .where('id = :uid', { uid })
        .execute();
      await queryRunner.commitTransaction();
      return '삭제가 완료되었습니다.';
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error);
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  @UseGuards()
  async getUserPosts(uid: number) {
    try {
      const manager = await this.dataSource.query(
        `select IU.url as imageUrl,P.title as postTitle,P.id As postId,
            (CASE
            WHEN L.userId=? AND P.userId =?
              THEN 'true'
                    ELSE 'false'
            END) AS isLikeByme
              from users AS U
              LEFT JOIN posts AS P
              ON P.userId = U.id
              LEFT JOIN images as I
              ON P.id = I.postId
              LEFT JOIN imageURL as IU
              ON I.imageUrlId = IU.id
              LEFT JOIN likes as L
              ON L.postId = P.id
              where U.id=? AND P.deletedAt is null;
    `,
        [uid, uid, uid],
      );
      return manager;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }
  @UseGuards()
  async getUserLikePosts(uid: number) {
    try {
      const manager = await this.dataSource.query(
        `select P.title,L.postId,IU.url from users AS U
      LEFT JOIN likes AS L
      ON L.userId = U.id
      LEFT JOIN posts AS P
      ON P.id = L.postId
      LEFT JOIN images AS I
      ON P.id = I.postId
      LEFT JOIN imageURL AS IU
      ON I.imageUrlId = IU.id
      where U.id = ? AND P.deletedAt is null`,
        [uid],
      );
      return manager;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
