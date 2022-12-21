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
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create.post.dto';
import { UpdatePostDto } from './dto/update.post.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/httpException.filter';

@ApiTags('포스트 API')
@UseFilters(HttpExceptionFilter)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '포스트 등록',
    description: '*hashtag 배열은 중복값을 가지면 안됩니다.',
  })
  @Post()
  //TODO : createDto userId 대체하기
  async createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Get()
  readAllPosts() {
    return this.postsService.readAllPosts();
  }

  @ApiOperation({
    summary: '특정 게시물 불러오기',
    description: 'post id를 이용해 게시물 불러오기',
  })
  @Get(':id')
  async readPost(@Param('id', ParseIntPipe) id: number) {
    return this.postsService.readPost(id);
  }

  @ApiOperation({
    summary: '포스트 수정',
    description: '*hashtag 배열은 중복값을 가지면 안됩니다.',
  })
  @Put(':id')
  async updatePost(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.updatePost(id, updatePostDto);
  }

  @Delete(':id')
  deletePost(@Param('id') id: string) {
    return this.postsService.deletePost(+id);
  }
}
