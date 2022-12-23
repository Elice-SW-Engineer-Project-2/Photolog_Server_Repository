import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { errorMsg } from 'src/common/messages/error.messages';
import { Likes, Posts } from 'src/entities';
import { DataSource } from 'typeorm';

@Injectable()
export class LikesService {
  constructor(private dataSource: DataSource) {}

  private async readLikeIncludingDeletedAtIsNotNull(
    postId: number,
    userId: number,
  ): Promise<Likes[]> {
    try {
      return await this.dataSource.query(
        'SELECT * FROM likes WHERE postId = ? AND userId = ?',
        [postId, userId],
      );
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async like(postId: number, userId: number): Promise<void> {
    const foundLike: Likes[] = await this.readLikeIncludingDeletedAtIsNotNull(
      postId,
      userId,
    );
    const doesLikeExist: boolean = foundLike.length !== 0 ? true : false;

    // 프론트에서 좋아요가 되어 있는 글에 다시 좋아요 요청을 보내는 경우 (FE should request unlike api)
    if (foundLike[0].deletedAt === null) {
      throw new BadRequestException(errorMsg.WRONG_LIKE_REQUEST);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (!doesLikeExist) {
        // 1. 최초 좋아요인 경우(좋아요가 존재하지 않는 경우) insert
        await queryRunner.manager
          .getRepository(Likes)
          .createQueryBuilder()
          .insert()
          .into(Likes)
          .values({ postId, userId })
          .execute();
      } else {
        // 2. unlike했다가 다시 좋아요 하는 경우 restore
        await queryRunner.manager
          .getRepository(Likes)
          .createQueryBuilder()
          .restore()
          .where('id = :id', { id: foundLike[0].id })
          .execute();
      }

      // 2. posts 테이블 likesCount 증가시키기
      await queryRunner.manager
        .getRepository(Posts)
        .createQueryBuilder()
        .update(Posts)
        .set({ likesCount: () => 'likesCount + 1' })
        .where({ id: postId })
        .execute();
      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error);
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async unlike(postId: number, userId: number): Promise<void> {
    const foundLike: Likes[] = await this.readLikeIncludingDeletedAtIsNotNull(
      postId,
      userId,
    );

    // 프론트에서 좋아요가 해제되어 있는 글에 다시 좋아요 해제 요청을 보내는 경우 (FE should request like api)
    if (foundLike[0].deletedAt !== null) {
      throw new BadRequestException(errorMsg.WRONG_UNLIKE_REQUEST);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1. 좋아요 해제
      await queryRunner.manager
        .getRepository(Likes)
        .createQueryBuilder()
        .softDelete()
        .where('id = :id', { id: foundLike[0].id })
        .execute();

      // 2. posts 테이블 likesCount 감소시키기
      await queryRunner.manager
        .getRepository(Posts)
        .createQueryBuilder()
        .update(Posts)
        .set({ likesCount: () => 'likesCount - 1' })
        .where({ id: postId })
        .execute();
      await queryRunner.commitTransaction();
      return;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error);
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }
}
