import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  Put,
  HttpCode,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@ApiTags('댓글 API')
@Controller()
export class CommentsController {
  //TODO : useId dto에서 빼고 req에서 가져오기
  constructor(private readonly commentsService: CommentsService) {}

  @ApiOperation({
    summary: '댓글 등록',
  })
  @Post('posts/:postId/comments')
  @HttpCode(201)
  async createComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId', ParseIntPipe) postId: number,
  ): Promise<void> {
    return this.commentsService.createComment(postId, createCommentDto);
  }

  @ApiOperation({
    summary: '댓글 수정',
  })
  @HttpCode(201)
  @Put('comments/:commentId')
  async updateComment(
    @Body() updateCommentDto: UpdateCommentDto,
    @Param('commentId', ParseIntPipe) commentId: number,
  ): Promise<void> {
    return this.commentsService.updateComment(commentId, updateCommentDto);
  }

  @ApiOperation({
    summary: '댓글 삭제',
  })
  @HttpCode(200)
  @Delete('comments/:commentId')
  remove(@Param('commentId', ParseIntPipe) commentId: number): Promise<void> {
    return this.commentsService.deleteComment(commentId);
  }
}
