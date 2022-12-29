import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './dtos/auth.dto';
import * as jwt from 'jsonwebtoken';
import { UsersService } from 'src/users/users.service';
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthResetPasswordDto } from './dtos/auth.reset-password.dto';

@ApiTags('AUTH API')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @ApiOperation({
    summary: '유저 로그인',
    description:
      '유저의 email과 password를 입력받아 access token을 응답값으로 리턴해주고 성공시 refresh token이 쿠키에 저장됩니다.',
  })
  @ApiBody({ type: AuthDto })
  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Niwicm9sZSI6ImdlbmVyYWwiLCJpYXQiOjE2NzE4Mjk5NjgsImV4cCI6MTY3MTg0MDc2OH0.mKNyUamd0Gc29qcZRrLQc83KbuvPs3zd5Uji4ctg2dw',
      },
    },
  })
  // @ApiUnauthorizedResponse({ status: 401 })
  @ApiUnauthorizedResponse({
    status: 401,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-23T21:04:22.775Z',
        statusCode: 401,
        message: '패스워드가 불일치합니다.',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 404,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-24T06:28:22.827Z',
        statusCode: 404,
        message: '등록되지않은 user 입니다.',
        error: 'Not Found',
      },
    },
  })
  @Post('login')
  async login(@Body() body: AuthDto, @Res() res: Response): Promise<any> {
    const tokens = await this.authService.getAccessAndRefreshToken(body);
    const { accessToken, refreshToken } = tokens;
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });
    res.json({
      //res 쓰면 반드시 res.json 써야해서 interceptor 양식처럼 적어주는것으로..
      success: true,
      data: accessToken,
    });
  }

  @ApiOkResponse({
    status: 200,
    schema: {
      example: {
        success: 'true',
        data: 'refresh token 제거완료',
      },
    },
  })
  @ApiOperation({
    summary: '유저 로그아웃',
    description: '클라이언트의 refresh token 쿠키를 삭제합니다.',
  })
  @Get('logout')
  async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('refresh_token');
    res.json({
      success: 'true',
      data: 'refresh token 제거완료',
    });
  }

  @ApiOperation({
    summary: 'access token 재발급',
    description:
      '클라이언트의 refresh token 쿠키를 서버에서 확인하여 access token을 발급받습니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        data: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Niwicm9sZSI6ImdlbmVyYWwiLCJpYXQiOjE2NzE4MzA4MjcsImV4cCI6MTY3MTg0MTYyN30.MiLVg58LsndkLX3HlIlkha009IbvXxh2hi9DApiualU',
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-23T21:25:41.594Z',
        statusCode: 401,
        message: 'refresh token 미존재. access token을 발급할 수 없습니다.',
        error: 'Unauthorized',
      },
    },
  })
  @Get('renewAccessToken')
  async renewAccessToken(@Req() req: Request): Promise<any> {
    const token = req.cookies.refresh_token;
    if (!token) {
      throw new UnauthorizedException(
        'refresh token 미존재. access token을 발급할 수 없습니다.',
      );
    }
    try {
      const verifyResult = jwt.verify(token, process.env.REFRESH_SECRET);
      const access_token = await this.authService.newAccessToken(
        verifyResult['id'],
      );
      return access_token;
    } catch (err) {
      throw new UnauthorizedException('토큰 발급에 실패하였습니다.');
    }
  }

  @ApiOperation({
    summary: 'access token 검증예시',
    description:
      '테스트용으로 써보시면 됩니다. 프론트에서 전역으로 관리하는 access token을 authorization header에 넣어주면 서버에서 확인하여 access token을 검증해보는 예시입니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        data: {
          id: 6,
          role: 'general',
          iat: 1671831111,
          exp: 1671841911,
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    status: 401,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-23T21:29:12.501Z',
        statusCode: 401,
        message: '올바르지 않은 토큰입니다.',
        error: 'Unauthorized',
      },
    },
  })
  @Get('verifyAccessToken')
  async verifyAccessToken(@Req() req: Request): Promise<any> {
    const authHeader = req.get('Authorization');
    if (!(authHeader && authHeader.startsWith('Bearer'))) {
      throw new UnauthorizedException(
        'header에 bearer token이 존재하지 않습니다.',
      );
    }
    const token = authHeader.split(' ')[1];
    try {
      const payload = jwt.verify(token, process.env.ACCESS_SECRET);
      return payload;
    } catch (err) {
      throw new UnauthorizedException('올바르지 않은 토큰입니다.');
    }
  }

  @ApiOperation({
    summary: '임시패스워드 발급',
    description: '임시패스워드를 발급하는 예시입니다.',
  })
  @ApiCreatedResponse({
    status: 200,
    schema: {
      example: {
        success: true,
        data: '임시 패스워드가 메일로 전송되었습니다.',
      },
    },
  })
  @ApiResponse({
    status: 401,
    schema: {
      example: {
        success: false,
        timestamp: '2022-12-24T06:20:01.626Z',
        statusCode: 401,
        message: '해당 계정이 존재하지 않습니다.',
        error: 'Not Found',
      },
    },
  })
  @Post('resetPassword')
  async resetPassword(@Body() body: AuthResetPasswordDto): Promise<any> {
    return await this.authService.resetPassword(body.email);
  }
}
