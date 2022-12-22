import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
  Res,
  Req,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(data: AuthDto, @Res() res: Response): Promise<any> {
    const { email, password } = data;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('등록되지않은 user 입니다.');
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      throw new UnauthorizedException('패스워드가 불일치합니다.');
    }

    const accessToken = await this.newAccessToken(user.id);
    const refreshToken = this.newRefreshToken(user.id);

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.json({ accessToken, refreshToken });
  }
  async logout(@Res() res: Response) {
    res.clearCookie('refresh_token');
    return res.json('logout : refresh_token 제거완료');
  }
  async renewAccessToken(@Req() req: Request, @Res() res: Response) {
    const token = req.cookies.refresh_token;
    console.log('cookies:', req.cookies);
    console.log(token);
    let payload;
    if (!token) {
      throw new UnauthorizedException(
        'refresh token 미존재. access token을 발급할 수 없습니다.',
      );
    }
    try {
      const verifyResult = jwt.verify(token, process.env.ACCESS_SECRET);
      payload = verifyResult;
    } catch (err) {
      console.log('err: ', err);
      throw new UnauthorizedException('토큰 검증에 실패하였습니다.');
    }
    console.log(payload);
    return payload;
  }

  newRefreshToken(userId: number) {
    return jwt.sign(
      {
        id: userId,
      },
      process.env.REFRESH_SECRET,
      {
        expiresIn: '14d',
      },
    );
  }

  async newAccessToken(userId: number) {
    const payload = { id: userId, role: 'general' };
    return this.jwtService.signAsync(payload);
  }

  async newAdminAccessToken(userId: number) {
    return this.jwtService.signAsync(
      {
        id: userId,
        role: 'admin',
      },
      {
        expiresIn: '3h',
      },
    );
  }
  verifyAccessToken(@Req() req: Request, @Res() res: Response) {
    const authHeader = req.get('Authorization');
    console.log('authHeader: ', authHeader);
    if (!(authHeader && authHeader.startsWith('Bearer'))) {
      throw new UnauthorizedException(
        'header에 bearer token이 존재하지 않습니다.',
      );
    }
    console.log('env: ', process.env.ACCESS_SECRET);
    const token = authHeader.split(' ')[1];
    console.log('token: ', token);
    try {
      const payload = jwt.verify(token, process.env.ACCESS_SECRET);
      console.log('payload :', payload);
      return res.json(payload);
    } catch (err) {
      return res.json({
        success: 'failed',
      });
    }
  }
}
