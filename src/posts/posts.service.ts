import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { errorMsg } from 'src/common/messages/error.messages';
import { complement } from 'src/common/utils/setMethod';
import { Images, Posts, Tags, Hashtags, Users, Likes } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create.post.dto';
import { ReadPostDto } from './dto/read.post.dto';
import { UpdatePostDto } from './dto/update.post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(Likes)
    private readonly likesRepository: Repository<Likes>,
    private dataSource: DataSource,
  ) {}

  async createPost(createPostDto: CreatePostDto) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1. 게시물 등록
      const savedPost: Posts = await queryRunner.manager
        .getRepository(Posts)
        .save({
          userId: createPostDto.userId,
          title: createPostDto.title,
          content: createPostDto.content,
        });

      // 2. 등록된 게시물 id를 가지고 사진 등록
      await queryRunner.manager.getRepository(Images).save({
        imageUrlId: createPostDto.imageUrlId,
        lensId: createPostDto.lensId,
        cameraId: createPostDto.cameraId,
        post: savedPost,
        latitude: createPostDto.latitude,
        longitude: createPostDto.longitude,
        locationInfo: createPostDto.locationInfo,
        takenAt: createPostDto.takenAt,
      });

      // 3. 해시태그 등록
      // // 1. 태그들 등록(unique)
      // TODO: orIngore로 변경
      if (createPostDto.hashtags.length === 0) {
        await queryRunner.commitTransaction();
        return savedPost;
      }
      const hashtagsToFind: { name: string }[] = createPostDto.hashtags.map(
        (item: string) => ({
          name: item,
        }),
      );

      const foundTags: Tags[] = await queryRunner.manager
        .getRepository(Tags)
        .findBy(hashtagsToFind);

      const existingTags: string[] = foundTags.map((item) => item.name);

      const toSaveTags: { name: string }[] = createPostDto.hashtags
        .filter((item) => !existingTags.includes(item))
        .map((item) => ({ name: item }));

      const savedTags: Tags[] = await queryRunner.manager
        .getRepository(Tags)
        .save(toSaveTags);

      const allTags: Tags[] = [...foundTags, ...savedTags];

      // // 2. 태그 post연결 (hashtags 테이블)
      const toSaveHashtags: { post: Posts; tagId: number }[] = allTags.map(
        (item) => ({
          post: savedPost,
          tagId: item.id,
        }),
      );
      await queryRunner.manager.getRepository(Hashtags).save(toSaveHashtags);

      await queryRunner.commitTransaction();
      return savedPost;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      Logger.error(error);
      throw new BadRequestException(error);
    } finally {
      await queryRunner.release();
    }
  }

  async readPosts(readPostDto: ReadPostDto, user: Users) {
    const userId = user?.id;
    // 첫 로딩. endPostId 없을 경우
    if (!readPostDto.endPostId) {
      const foundPosts = await this.postsRepository
        .createQueryBuilder('posts')
        .select([
          'posts.id',
          'posts.title',
          'posts.content',
          'posts.likesCount',
          'postUser.id',
          'postUserProfile.nickname',
          'postUserProfileImage',
          'images.id',
          'imageUrl.url',
          'likes.userId',
        ])
        .leftJoin('posts.user', 'postUser')
        .leftJoin('postUser.profiles', 'postUserProfile')
        .leftJoin('postUserProfile.image', 'postUserProfileImage')
        .leftJoin('posts.images', 'images')
        .leftJoin('images.imageUrl', 'imageUrl')
        .leftJoin('posts.likes', 'likes')
        .orderBy('posts.createdAt', 'DESC')
        .limit(readPostDto.quantity)
        .getMany();
      console.log(foundPosts);

      const result = foundPosts.map((post) => {
        let isLiked = false;
        post.likes.some((like) => {
          if (like.userId === userId) {
            isLiked = true;
            return true;
          }
        });
        const { likes, ...resultWithoutLikes } = post;

        return { isLiked, ...resultWithoutLikes };
      });
      return result;
    }

    // 이후 로딩. endPostId 있을 경우
    const foundPosts = await this.postsRepository
      .createQueryBuilder('posts')
      .select([
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.likesCount',
        'postUser.id',
        'postUserProfile.nickname',
        'postUserProfileImage',
        'images.id',
        'imageUrl.url',
        'likes.userId',
      ])
      .leftJoin('posts.user', 'postUser')
      .leftJoin('postUser.profiles', 'postUserProfile')
      .leftJoin('postUserProfile.image', 'postUserProfileImage')
      .leftJoin('posts.images', 'images')
      .leftJoin('images.imageUrl', 'imageUrl')
      .leftJoin('posts.likes', 'likes')
      .orderBy('posts.createdAt', 'DESC')
      .limit(readPostDto.quantity)
      .where('id < :endPostId', { endPostId: readPostDto.endPostId })
      .getMany();

    const result = foundPosts.map((post) => {
      let isLiked = false;
      post.likes.some((like) => {
        if (like.userId === userId) {
          isLiked = true;
          return true;
        }
      });
      const { likes, ...resultWithoutLikes } = post;

      return { isLiked, ...resultWithoutLikes };
    });
    return result;
  }

  async readPost(id: number, user: Users) {
    const doesExistPost: Posts = await this.postsRepository.findOneBy({ id });
    if (!doesExistPost) {
      throw new NotFoundException(errorMsg.NOT_FOUND_POST);
    }

    let isLiked: boolean = false;
    // 로그인 되어있는 상태에서 api요청시 isLiked 조회
    if (user) {
      const foundLike = await this.likesRepository.findOneBy({
        userId: user.id,
        postId: id,
      });
      isLiked = foundLike ? true : false;
    }

    const foundPost = await this.postsRepository
      .createQueryBuilder('posts')
      .select([
        'posts.title',
        'posts.content',
        'posts.likesCount',
        'posts.createdAt',
        'posts.updatedAt',
        'postUser.id',
        'postUserProfile.nickname',
        'postUserProfileImage',
        'images',
        'imageUrl.url',
        'lens.model',
        'camera.model',
        'comments.id',
        'comments.content',
        'comments.createdAt',
        'comments.updatedAt',
        'commentUser.id',
        'commentUserProfiles.nickname',
        'commentUserProfileImage',
        'hashtags.id',
        'tags.name',
      ])
      .leftJoin('posts.user', 'postUser')
      .leftJoin('postUser.profiles', 'postUserProfile')
      .leftJoin('postUserProfile.image', 'postUserProfileImage')
      .leftJoin('posts.images', 'images')
      .leftJoin('images.lens', 'lens')
      .leftJoin('images.camera', 'camera')
      .leftJoin('images.imageUrl', 'imageUrl')
      .leftJoin('posts.comments', 'comments')
      .leftJoin('comments.user', 'commentUser')
      .leftJoin('commentUser.profiles', 'commentUserProfiles')
      .leftJoin('commentUserProfiles.image', 'commentUserProfileImage')
      .leftJoin('posts.hashtags', 'hashtags')
      .leftJoin('hashtags.tag', 'tags')
      .where('posts.id = :id', { id })
      .getOne();

    return { isLiked, ...foundPost };
  }

  async updatePost(id: number, updatePostDto: UpdatePostDto) {
    const doesExistPost = await this.postsRepository.findOneBy({ id });
    if (!doesExistPost) {
      throw new NotFoundException(errorMsg.NOT_FOUND_POST);
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // 1. 게시물 수정
      await queryRunner.manager
        .createQueryBuilder()
        .update(Posts)
        .set({ title: updatePostDto.title, content: updatePostDto.content })
        .where('id=:id', { id })
        .execute();

      // 2. 사진 수정
      await queryRunner.manager
        .createQueryBuilder()
        .update(Images)
        .set({
          imageUrlId: updatePostDto.imageUrlId,
          lensId: updatePostDto.lensId,
          cameraId: updatePostDto.cameraId,
          latitude: updatePostDto.latitude,
          longitude: updatePostDto.longitude,
          locationInfo: updatePostDto.locationInfo,
          takenAt: updatePostDto.takenAt,
        })
        .where('postId=:id', { id })
        .execute();

      // 3. 해시태그 수정
      // 해당 게시물에 있는 태그 조회
      const foundTags: { hashtagId: number; tagName: string }[] =
        await queryRunner.manager
          .getRepository(Hashtags)
          .createQueryBuilder('hashtags')
          .select('hashtags.id', 'hashtagId')
          .addSelect('tags.name', 'tagName')
          .leftJoin('hashtags.tag', 'tags')
          .where({ postId: id })
          .execute();

      const oldTags: string[] = foundTags.map((item) => item.tagName);
      const newTags: string[] = updatePostDto.hashtags;

      const tagsToDelete: { id: number }[] = foundTags
        .filter((item) => !newTags.includes(item.tagName))
        .map((item) => ({ id: item.hashtagId }));
      // const tagsToDelete = complement(oldTags, newTags);
      const tagsToInsert: { name: string }[] = complement(newTags, oldTags).map(
        (item) => ({
          name: item,
        }),
      );
      // // 1. 지워질 태그는 삭제 in hashtags table
      if (tagsToDelete.length !== 0) {
        await queryRunner.manager
          .getRepository(Hashtags)
          .createQueryBuilder()
          .softDelete()
          .where(tagsToDelete)
          .execute();
      }

      // // 2. 새로운 태그는 등록
      if (tagsToInsert.length !== 0) {
        await queryRunner.manager
          .getRepository(Tags)
          .createQueryBuilder()
          .insert()
          .into(Tags)
          .values(tagsToInsert)
          .orIgnore()
          .execute();

        const foundTagsAfterInsert: Tags[] = await queryRunner.manager
          .getRepository(Tags)
          .find({ where: tagsToInsert });

        const toSaveHashtags: { postId: number; tagId: number }[] =
          foundTagsAfterInsert.map((item) => ({
            postId: id,
            tagId: item.id,
          }));
        await queryRunner.manager.getRepository(Hashtags).save(toSaveHashtags);
      }

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

  async deletePost(id: number) {
    const result = await this.postsRepository
      .createQueryBuilder()
      .softDelete()
      .where('id = :id', { id })
      .execute();

    return result;
  }

  async findPostById(id: number): Promise<Posts> {
    return this.postsRepository.findOne({ where: { id } });
  }
}
