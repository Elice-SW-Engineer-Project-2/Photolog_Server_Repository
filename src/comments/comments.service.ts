import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { errorMsg } from 'src/common/messages/error.messages';
import { Comments, Posts } from 'src/entities';
import { Repository } from 'typeorm';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comments)
    private readonly commentsRepositoty: Repository<Comments>,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
  ) {}

  async createComment(
    postId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<void> {
    const postExists: boolean = await this.doesExistPost(postId);
    if (!postExists) {
      throw new NotFoundException(errorMsg.NOT_FOUND_POST);
    }
    await this.commentsRepositoty.save({
      ...createCommentDto,
      postId,
    });
    return;
  }

  async updateComment(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    await this.commentsRepositoty.update({ id: commentId }, updateCommentDto);
    return;
  }

  async deleteComment(commentId: number): Promise<void> {
    await this.commentsRepositoty.softDelete(commentId);
    return;
  }

  private async doesExistPost(id: number): Promise<boolean> {
    const foundPost: Posts = await this.postsRepository.findOneBy({
      id,
    });
    return foundPost ? true : false;
  }
}
