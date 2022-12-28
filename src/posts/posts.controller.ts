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
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOperation,
  ApiProperty,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/httpException.filter';
import { ReadPostDto } from './dto/read.post.dto';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { PostAuthorizationGuard } from 'src/posts/authorization/post-authorization.guard';
import { Users } from 'src/entities';
import { CurrentUser } from 'src/common/decorators/user.decorator';

@ApiTags('포스트 API')
@UseFilters(HttpExceptionFilter)
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiOperation({
    summary: '지도 위치기반 게시물 정보조회',
    description:
      '위도 경도 데이터 범위를 기반으로 관련 게시물들의 정보를 받습니다.',
  })
  @ApiProperty({
    example: {
      latlng: {
        sw: {
          lat: 37.48970512,
          lng: 126.72134047,
        },
        ne: {
          lat: 37.49551104,
          lng: 126.73862053,
        },
      },
    },
  })
  @ApiCreatedResponse({
    status: 0,
    schema: {
      example: {
        latlng: {
          sw: {
            lat: 37.48970512,
            lng: 126.72134047,
          },
          ne: {
            lat: 37.49551104,
            lng: 126.73862053,
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        data: [
          {
            postId: 20,
            latitude: 37.494772460624354,
            longitude: 126.72861270174135,
            imageURL:
              'https://photolog-bucket.s3.ap-northeast-2.amazonaws.com/original/fe2846a3-8c86-45d0-8a86-a9776b7f6cdb.IMG_5018_Edited.jpg',
            hashtag: null,
          },
          {
            postId: 7,
            latitude: 37.4905399,
            longitude: 126.7282486,
            imageURL:
              'https://photolog-bucket.s3.ap-northeast-2.amazonaws.com/original/fe2846a3-8c86-45d0-8a86-a9776b7f6cdb.IMG_5018_Edited.jpg',
            hashtag: ['돈까스', '짜장면', '떡볶이'],
          },
        ],
      },
    },
  })
  @Get('map')
  async getMapPostInfoByLatLng(@Body() body) {
    return this.postsService.getMapPostInfoByLatLng(body.latlng);
  }
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
