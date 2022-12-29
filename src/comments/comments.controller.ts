import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities';
import { CommentsAuthorizationGuard } from './authorization/comment-authorization.guard';
import { CommentsService } from './comments.service';

import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('댓글 API')
@Controller('api')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: '댓글 등록',
  })
  @ApiBearerAuth('Authorization')
  @HttpCode(201)
  @Post('posts/:postId/comments')
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: Users,
  ): Promise<void> {
    const userId = user.id;
    return this.commentsService.createComment(postId, userId, createCommentDto);
  }

  @UseGuards(JwtAuthGuard, CommentsAuthorizationGuard)
  @ApiOperation({
    summary: '댓글 수정',
  })
  @ApiBearerAuth('Authorization')
  @HttpCode(201)
  @Put('comments/:commentId')
  async updateComment(
    @Body() updateCommentDto: UpdateCommentDto,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<void> {
    return this.commentsService.updateComment(commentId, updateCommentDto);
  }

  @UseGuards(JwtAuthGuard, CommentsAuthorizationGuard)
  @ApiOperation({
    summary: '댓글 삭제',
  })
  @ApiBearerAuth('Authorization')
  @HttpCode(200)
  @Delete('comments/:commentId')
  remove(@Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    return this.commentsService.deleteComment(commentId);
  }
}
