import { Controller, Param, ParseIntPipe, Put } from '@nestjs/common';
import { Get } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Profile } from 'src/entities';
import { ProfilesService } from './profiles.service';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import {
  ApiOperation,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
@ApiTags('프로필 API')
@Controller('api/profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @ApiOperation({
    summary: '유저 프로필 사진 수정',
    description: '유저의 프로필 사진을 수정하는 API입니다.',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        data: [
          {
            profile_nickname: 'test12',
            user_email: 'test12@test.com',
            image_url: 'http://test.com | null',
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-27T11:19:42.269Z',
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 403,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-27T12:03:15.921Z',
        statusCode: 403,
        message: '이미지 변경이 불가능합니다.',
        error: 'Forbidden',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Put('image/:imageUrlId')
  async changeProfileImage(
    @CurrentUser() user,
    @Param('imageUrlId', ParseIntPipe) imageUrlId: number,
  ) {
    return this.profilesService.changeProfileImage(user.id, imageUrlId);
  }

  @ApiOperation({
    summary: '유저 프로필 정보 조회',
    description: '유저의 프로필 정보에 대한 정보를 주는 API입니다.',
  })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        data: [
          {
            profile_nickname: 'test12',
            user_email: 'test12@test.com',
            image_url: 'http://test.com',
          },
        ],
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
            profile_nickname: 'test1234',
            user_email: 'test1234@test.com',
            image_url: null,
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-27T11:19:42.269Z',
        statusCode: 401,
        message: 'Unauthorized',
      },
    },
  })
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Get('user')
  async getProfile(@CurrentUser() user): Promise<Profile> {
    return this.profilesService.getProfile(user.id);
  }
}
