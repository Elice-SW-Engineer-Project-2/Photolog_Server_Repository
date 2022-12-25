import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Posts } from 'src/entities';
import { PostsService } from '../posts.service';
import { errorMsg } from '../../common/messages/error.messages';

@Injectable()
export class PostAuthorizationGuard implements CanActivate {
  constructor(private readonly postsService: PostsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestUserId: number = request.user.id;
    const postId: number = parseInt(request.params.postId);
    try {
      const foundPost: Posts = await this.postsService.findPostById(postId);
      if (!foundPost) {
        throw new NotFoundException(errorMsg.NOT_FOUND_POST);
      }
      const postUserId: number = foundPost.userId;
      return requestUserId === postUserId ? true : false;
    } catch (error) {
      throw new BadRequestException(errorMsg.DB_ERROR);
    }
  }
}
