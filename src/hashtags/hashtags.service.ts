import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { errorMsg } from 'src/common/messages/error.messages';
import { Hashtags, Likes, Posts, Tags, Users } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class HashtagsService {
  constructor(
    @InjectRepository(Hashtags)
    private readonly hashtagsRepository: Repository<Hashtags>,
    @InjectRepository(Tags)
    private readonly tagsRepository: Repository<Tags>,
  ) {}

  async readPosts(keyword: string, user: Users) {
    const userId: number | undefined | null = user?.id;

    const foundTag: Tags = await this.tagsRepository.findOneBy({
      name: keyword,
    });
    if (!foundTag) {
      throw new NotFoundException(errorMsg.NOT_FOUND_HASHTAG);
    }

    const foundPosts: Hashtags[] = await this.hashtagsRepository
      .createQueryBuilder('hashtags')
      .select([
        'hashtags.id',
        'posts.id',
        'posts.title',
        'posts.content',
        'posts.likesCount',
        'postUser.id',
        'postUserProfile.nickname',
        'postUserProfileImage',
        'images.id',
        'images.latitude',
        'images.longitude',
        'imageUrl.url',
        'likes.userId',
      ])
      .leftJoin('hashtags.post', 'posts')
      .leftJoin('posts.user', 'postUser')
      .leftJoin('postUser.profiles', 'postUserProfile')
      .leftJoin('postUserProfile.image', 'postUserProfileImage')
      .leftJoin('posts.images', 'images')
      .leftJoin('images.imageUrl', 'imageUrl')
      .leftJoin('posts.likes', 'likes')
      .where('tagId = :tagId', { tagId: foundTag.id })
      .getMany();

    const result = foundPosts.map(({ post }) => {
      let isLiked = false;
      post.likes.some((like: Likes) => {
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
}
