import { Injectable, UnauthorizedException, Res, Req } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import { AuthDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt/dist';

interface Tokens {
  accessToken: string;
  refreshToken: string;
}
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async getAccessAndRefreshToken(data: AuthDto): Promise<Tokens> {
    const { email, password } = data;
    console.log(data);
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
    return { accessToken, refreshToken };
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
  getMailTransportInfo() {
    return {
      service: 'Gmail',
      auth: {
        user: process.env.AUTH_GMAIL_FROM,
        pass: process.env.AUTH_GMAIL_PASSWORD,
      },
    };
  }
  getMailMessageInfo(email) {
    return {
      from: process.env.AUTH_GMAIL_FROM,
      to: email,
      subject: 'Photolog 임시패스워드 전송',
      text: 'text Field',
    };
  }
  generateRandomPassword() {
    const chars =
      '0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const passwordLength = 12;
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomNumber = Math.floor(Math.random() * chars.length);
      password += chars.substring(randomNumber, randomNumber + 1);
    }
    return password;
  }
}
