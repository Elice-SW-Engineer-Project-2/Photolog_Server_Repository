import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
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
    userId: number,
    createCommentDto: CreateCommentDto,
  ): Promise<void> {
    try {
      const postExists: boolean = await this.doesExistPost(postId);
      if (!postExists) {
        throw new NotFoundException(errorMsg.NOT_FOUND_POST);
      }
      await this.commentsRepositoty.save({
        ...createCommentDto,
        userId,
        postId,
      });
      return;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async updateComment(
    commentId: number,
    updateCommentDto: UpdateCommentDto,
  ): Promise<void> {
    try {
      await this.commentsRepositoty.update({ id: commentId }, updateCommentDto);
      return;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async deleteComment(commentId: number): Promise<void> {
    try {
      await this.commentsRepositoty.softDelete(commentId);
      return;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }

  private async doesExistPost(id: number): Promise<boolean> {
    try {
      const foundPost: Posts = await this.postsRepository.findOneBy({
        id,
      });
      return foundPost ? true : false;
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async findCommentById(id: number) {
    try {
      return this.commentsRepositoty.findOne({ where: { id } });
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
