import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseFilters,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiBody,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { HttpExceptionFilter } from 'src/common/exceptions/httpException.filter';
import { UserSignUpDto } from './dto/user.signup.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UsersService } from './users.service';

import { Users } from 'src/entities';
import { UserProfileNicknameUpdateDto } from './dto/user.update.profile-nickname.dto';
import { CurrentUser } from 'src/common/decorators/user.decorator';
@ApiTags('유저 API')
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({
    summary: '유저 마이페이지 내 사진 게시물 조회',
    description:
      '로그인 되어있는 유저의 사진 게시물과 관련한 정보를 조회해주는 API입니다.',
  })
  @ApiBearerAuth('Autorization')
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        data: [
          {
            imageUrl:
              'https://photolog-bucket.s3.ap-northeast-2.amazonaws.com/original/fe2846a3-8c86-45d0-8a86-a9776b7f6cdb.IMG_5018_Edited.jpg',
            postTitle: '자동화제목',
            postId: 11,
          },
          {
            imageUrl:
              'https://photolog-bucket.s3.ap-northeast-2.amazonaws.com/original/fe2846a3-8c86-45d0-8a86-a9776b7f6cdb.IMG_5018_Edited.jpg',
            postTitle: '자동화제목',
            postId: 12,
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 400,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-28T12:11:25.896Z',
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('mypage/posts')
  async getUserPosts(@CurrentUser() user) {
    return this.usersService.getUserPosts(user.id);
  }

  @ApiOperation({
    summary: '유저 마이페이지 좋아요 게시물 조회',
    description:
      '로그인 되어있는 유저가 좋아요한 사진 게시물과 관련한 정보를 조회해주는 API입니다.',
  })
  @ApiBearerAuth('Autorization')
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        data: [
          {
            title: '자동화제목',
            postId: 30,
            url: 'https://photolog-bucket.s3.ap-northeast-2.amazonaws.com/original/fe2846a3-8c86-45d0-8a86-a9776b7f6cdb.IMG_5018_Edited.jpg',
          },
          {
            title: '자동화제목',
            postId: 49,
            url: 'https://photolog-bucket.s3.ap-northeast-2.amazonaws.com/original/fe2846a3-8c86-45d0-8a86-a9776b7f6cdb.IMG_5018_Edited.jpg',
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 400,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-28T12:11:25.896Z',
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Get('mypage/likePosts')
  async getUserLikePosts(@CurrentUser() user) {
    console.log(user.id);
    return this.usersService.getUserLikePosts(user.id);
  }
  @ApiOperation({
    summary: '유저 회원가입',
    description:
      '유저의 email과 pasword, nickname을 받아서 회원가입을 처리 함 password : 8자리 이상',
  })
  @ApiOkResponse({
    type: UserSignUpDto,
    status: 200,
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiResponse({
    status: 400,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-24T17:15:54.542Z',
        statusCode: 400,
        message: '해당하는 이메일은 이미 존재합니다.',
        error: 'Bad Request',
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 400,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-24T17:11:29.233Z',
        statusCode: 400,
        message: '해당하는 닉네임은 이미 존재합니다.',
        error: 'Bad Request',
      },
    },
  })
  @ApiConflictResponse({
    status: 400,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-24T17:16:26.898Z',
        statusCode: 400,
        message: ['password must be longer than or equal to 8 characters'],
        error: 'Bad Request',
      },
    },
  })
  @Post()
  async signUp(@Body() userSignUpDto: UserSignUpDto): Promise<void> {
    return this.usersService.signUp(userSignUpDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getUser(@CurrentUser() user) {
    return this.usersService.findById(user.id);
  }

  @ApiOperation({
    summary: '유저 패스워드 수정',
    description:
      'authorization header에 access token을 함께 담아 요청시 패스워드 수정이 완료됩니다.',
  })
  @ApiOkResponse({
    type: UserSignUpDto,
    status: 200,
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiBody({ type: UserUpdateDto })
  @ApiBearerAuth('Autorization')
  @UseGuards(JwtAuthGuard)
  @Patch('password')
  async updateUserPassword(
    @CurrentUser() user: Users,
    @Body() password: UserUpdateDto,
  ) {
    return this.usersService.updateUserPassword(user.id, password);
  }

  @ApiOperation({
    summary: '닉네임 수정',
    description:
      'authorization header에 access token을 함께 담아 요청시 닉네임 수정이 완료됩니다.',
  })
  @ApiOkResponse({
    type: UserProfileNicknameUpdateDto,
    status: 200,
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiBody({ type: UserProfileNicknameUpdateDto })
  @ApiBearerAuth('Autorization')
  @UseGuards(JwtAuthGuard)
  @Patch('nickname')
  async updateNickname(
    @CurrentUser() user: Users,
    @Body() body: UserProfileNicknameUpdateDto,
  ) {
    return this.usersService.updateNickname(user, body.nickname);
  }

  @ApiOperation({
    summary: '유저 탈퇴',
    description:
      'authorization header에 access token을 함께 담아 요청시 유저 탈퇴가 완료됩니다.',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        success: true,
      },
    },
  })
  @ApiBearerAuth('Authorization')
  @ApiUnauthorizedResponse({
    status: 404,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-24T17:23:45.499Z',
        statusCode: 401,
        message: 'Access failed',
        error: 'Unauthorized',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @Delete()
  async deleteUser(@CurrentUser() user) {
    await this.usersService.deleteUser(user.id);
  }
}
