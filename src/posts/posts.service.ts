import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Images, Posts, Tags, Hashtags } from 'src/entities';
import { DataSource, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create.post.dto';
import { UpdatePostDto } from './dto/update.post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
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
      const hashtagsToFind: { name: string }[] = createPostDto.hashtags.map(
        (item: string) => ({
          name: item,
        }),
      );

      const foundTags: Tags[] = await queryRunner.manager
        .getRepository(Tags)
        .findBy(hashtagsToFind);

      const ExistingTags: string[] = foundTags.map((item) => item.name);

      const toSaveTags: { name: string }[] = createPostDto.hashtags
        .filter((item) => !ExistingTags.includes(item))
        .map((item) => ({ name: item }));

      const savedTags: Tags[] = await queryRunner.manager
        .getRepository(Tags)
        .save(toSaveTags);

      const allTags: Tags[] = [...foundTags, ...savedTags];

      // // 2. 태그 post연결 (hashtags 테이블)
      const toSaveHashtags = allTags.map((item) => ({
        post: savedPost,
        tagId: item.id,
      }));
      const savedHashtags: Hashtags[] = await queryRunner.manager
        .getRepository(Hashtags)
        .save(toSaveHashtags);

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

  readAllPosts() {
    return `This action returns all posts`;
  }

  async readPost(id: number) {
    const foundPost = await this.postsRepository
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.images', 'images')
      .leftJoinAndSelect('images.imageUrl', 'imageUrl')
      .leftJoinAndSelect('posts.hashtags', 'hashtags')
      .leftJoinAndSelect('hashtags.tag', 'tags')
      .where('posts.id = :id', { id })
      .getOne();

    return foundPost;
  }

  updatePost(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  deletePost(id: number) {
    return `This action removes a #${id} post`;
  }
}
