import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { AuthDto } from './dtos/auth.dto';
import { JwtService } from '@nestjs/jwt/dist';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(data: AuthDto): Promise<any> {
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
    const refreshToken = await this.newRefreshToken(user.id);

    return {
      aceessToken: accessToken,
      refreshToken: refreshToken,
    };
  }
  // async verifyAccessToken() {}
  async newRefreshToken(userId: number) {
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
    return {
      token: this.jwtService.sign(payload),
    };
  }

  async newAdminAccessToken(userId: number) {
    return jwt.sign(
      {
        id: userId,
        role: 'admin',
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: '3h',
      },
    );
  }
}
