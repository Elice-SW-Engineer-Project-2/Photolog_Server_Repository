import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseFilters,
  ParseIntPipe,
  Put,
  HttpCode,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create.post.dto';
import { UpdatePostDto } from './dto/update.post.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/httpException.filter';
import { ReadPostDto } from './dto/read.post.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { PostAuthorizationGuard } from 'src/posts/authorization/post-authorization.guard';
import { CurrentUser } from 'src/comments/decorators/user.decorator';
import { Users } from 'src/entities';

@ApiTags('포스트 API')
@UseFilters(HttpExceptionFilter)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '포스트 등록',
    description: '*hashtag 배열은 중복값을 가지면 안됩니다.',
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Post()
  @HttpCode(201)
  async createPost(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser() user: Users,
  ) {
    createPostDto.userId = user.id;
    return this.postsService.createPost(createPostDto);
  }

  @ApiOperation({
    summary: '포스트 불러오기(무한 스크롤)',
    description: '무한스크롤을 위한 포스트 불러오기',
  })
  @ApiBearerAuth('Authorization')
  @Get()
  readPosts(@Query() readPostDto: ReadPostDto, @CurrentUser() user: Users) {
    return this.postsService.readPosts(readPostDto, user);
  }

  @ApiOperation({
    summary: '특정 포스트 불러오기',
    description: 'post id를 이용해 포스트 불러오기',
  })
  @ApiBearerAuth('Authorization')
  @Get(':postId')
  async readPost(
    @Param('postId', ParseIntPipe) postId: number,
    @CurrentUser() user: Users,
  ) {
    return this.postsService.readPost(postId, user);
  }

  @UseGuards(JwtAuthGuard, PostAuthorizationGuard)
  @ApiOperation({
    summary: '포스트 수정',
    description: '*hashtag 배열은 중복값을 가지면 안됩니다.',
  })
  @ApiBearerAuth('Authorization')
  @Put(':postId')
  async updatePost(
    @Param('postId', ParseIntPipe) postId: number,
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser() user: Users,
  ) {
    updatePostDto.userId = user.id;
    return this.postsService.updatePost(postId, updatePostDto);
  }

  @UseGuards(JwtAuthGuard, PostAuthorizationGuard)
  @ApiBearerAuth('Authorization')
  @ApiOperation({
    summary: '포스트 삭제',
  })
  @HttpCode(204)
  @Delete(':postId')
  async deletePost(@Param('postId', ParseIntPipe) postId: number) {
    return this.postsService.deletePost(postId);
  }
}
