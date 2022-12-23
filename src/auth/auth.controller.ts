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

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() body: AuthDto, @Res() res: Response): Promise<any> {
    const tokens = await this.authService.getAccessAndRefreshToken(body);
    const { accessToken, refreshToken } = tokens;
    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
    });
    res.json(accessToken);
  }

  @Get('logout')
  async logout(@Res() res: Response): Promise<any> {
    res.clearCookie('refresh_token');
    res.json('refresh token 제거완료');
  }

  @Get('renewAccessToken')
  async renewAccessToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const token = req.cookies.refresh_token;
    if (!token) {
      throw new UnauthorizedException(
        'refresh token 미존재. access token을 발급할 수 없습니다.',
      );
    }
    try {
      const verifyResult = jwt.verify(token, process.env.REFRESH_SECRET);
      console.log('verifyResfult : ', verifyResult);
      const access_token = await this.authService.newAccessToken(
        verifyResult['id'],
      );
      return res.json({
        access_token: access_token,
      });
    } catch (err) {
      console.log('err: ', err);
      throw new UnauthorizedException('토큰 발급에 실패하였습니다.');
    }
  }

  @Get('verifyAccessToken')
  async verifyAccessToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    const authHeader = req.get('Authorization');
    console.log('authHeader: ', authHeader);
    if (!(authHeader && authHeader.startsWith('Bearer'))) {
      throw new UnauthorizedException(
        'header에 bearer token이 존재하지 않습니다.',
      );
    }
    const token = authHeader.split(' ')[1];
    console.log('token: ', token);
    try {
      const payload = jwt.verify(token, process.env.ACCESS_SECRET);
      return res.json(payload);
    } catch (err) {
      return res.json({
        success: 'failed',
      });
    }
  }

  // @Post('renewPassword')
  // async renewPassword(@Req() req: Request, @Res() res: Response): Promise<any> {
  //   return this.authService.renewPassword(req, res);
  // }
}
