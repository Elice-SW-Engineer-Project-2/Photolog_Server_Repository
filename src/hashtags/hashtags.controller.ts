import { Controller, Get, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Users } from 'src/entities';
import { HashtagsService } from './hashtags.service';

@ApiTags('해시태그 API')
@Controller('hashtags')
export class HashtagsController {
  constructor(private readonly hashtagsService: HashtagsService) {}

  @ApiOperation({
    summary: '해시태그로 검색',
    description: '해시태그를 이용해 게시물들을 검색합니다.',
  })
  @ApiBearerAuth('Authorization')
  @Get(':keyword/posts')
  async readPosts(
    @Query('keyword') keyword: string,
    @CurrentUser() user: Users,
  ) {
    return await this.hashtagsService.readPosts(keyword, user);
  }
}
