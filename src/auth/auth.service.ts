import {
  Injectable,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async login(email: string, password: string): Promise<any> {
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new NotFoundException('등록되지않은 user 입니다.');
    }

    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      throw new NotAcceptableException('패스워드가 불일치합니다.');
    }
    const accessToken = await this.newAccessToken(user.id);
    const refreshToken = await this.newRefreshToken(user.id);

    return {
      user: user,
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
    return jwt.sign(
      {
        id: userId,
        role: 'general',
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: '3h',
      },
    );
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

  // private async newRefreshAndAccessToken(
  //   user: User,
  //   refreshToken: RefreshToken,
  // ): Promise<any> {
  //   const refreshObject = new RefreshToken({
  //     userId: this.user.id,
  //   });

  //   return {
  //     refreshToken: refreshObject.sign(),
  //     accessToken: sign(
  //       {
  //         userId:user.id,
  //         process.env.ACCESS_SECRET,
  //         {
  //           expiresIn:'3h',
  //         }
  //       }
  //     )
  //   };
  // }
}
