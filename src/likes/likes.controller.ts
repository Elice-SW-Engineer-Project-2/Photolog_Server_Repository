import {
  Controller,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities';
import { LikesService } from './likes.service';

@ApiTags('좋아요 API')
@Controller('api/posts')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}
  @ApiOperation({
    summary: '좋아요',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Post(':postId/like')
  async like(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: Users,
  ): Promise<void> {
    const userId = user.id;
    await this.likesService.like(postId, userId);
  }

  @ApiOperation({
    summary: '좋아요 해제',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Post(':postId/unlike')
  async unLike(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: Users,
  ) {
    const userId = user.id;
    await this.likesService.unlike(postId, userId);
  }
}
