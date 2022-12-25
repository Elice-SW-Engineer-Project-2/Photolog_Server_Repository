import {
  Injectable,
  CanActivate,
  ExecutionContext,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Comments } from 'src/entities';

import { errorMsg } from '../../common/messages/error.messages';
import { CommentsService } from '../comments.service';

@Injectable()
export class CommentsAuthorizationGuard implements CanActivate {
  constructor(private readonly commentsService: CommentsService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const requestUserId: number = request.user.id;
    const commentId: number = parseInt(request.params.commentId);
    try {
      const foundComment: Comments = await this.commentsService.findCommentById(
        commentId,
      );
      if (!foundComment) {
        throw new NotFoundException(errorMsg.NOT_FOUND_COMMENT);
      }
      const commentUserId: number = foundComment.userId;
      return requestUserId === commentUserId ? true : false;
    } catch (error) {
      throw new BadRequestException(errorMsg.DB_ERROR);
    }
  }
}
