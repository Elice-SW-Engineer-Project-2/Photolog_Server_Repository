import {
  Controller,
  Get,
  Post,
  Body,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './dtos/auth.dto';
import * as jwt from 'jsonwebtoken';
import * as nodeMailer from 'nodemailer';
import { CurrentUser } from 'src/comments/decorators/user.decorator';
import { JwtAuthGuard } from './jwt/jwt.guard';
import { UsersService } from 'src/users/users.service';
@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get('renewPassword')
  async renewPassword(@CurrentUser() user, @Req() req: Request): Promise<any> {
    const transportInfo = this.authService.getMailTransportInfo();
    const transport = nodeMailer.createTransport(transportInfo);

    const message = this.authService.getMailMessageInfo(user.email);
    const newPassword = this.authService.generateRandomPassword();
    message.text = `Password : ${newPassword}`;
    Object.freeze(message);

    try {
      await this.usersService.updateUserPassword(user.id, {
        password: newPassword,
      });
    } catch (err) {
      throw new UnauthorizedException(
        '유저 임시비밀번호 부여 후 수정도중 에러가 발생하였습니다.',
      );
    }

    transport.sendMail(message, (err, info) => {
      if (err) {
        throw new UnauthorizedException('임시 패스워드 메일 전송 실패');
      }
    });
  }
}
