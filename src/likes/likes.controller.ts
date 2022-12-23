import { Controller, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LikesService } from './likes.service';

@ApiTags('좋아요 API')
@Controller('posts')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  @ApiOperation({
    summary: '좋아요',
  })
  @Post(':postId/like')
  async like(@Param('postId', ParseIntPipe) postId: number): Promise<void> {
    const userId = 4; //TODO : userId 로직 수정
    await this.likesService.like(postId, userId);
  }

  @ApiOperation({
    summary: '좋아요 해제',
  })
  @Post(':postId/unlike')
  async unLike(@Param('postId', ParseIntPipe) postId: number) {
    const userId = 4; //TODO : userId 로직 수정
    await this.likesService.unlike(postId, userId);
  }
}
