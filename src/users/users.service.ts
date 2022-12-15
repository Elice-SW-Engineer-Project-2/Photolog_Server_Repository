import { BadRequestException, Injectable } from '@nestjs/common';
import { errorMsg } from 'src/common/messages/erro.messages';
import { UserSignUpDto } from './dto/user.signup.dto';
import { UsersDao } from './users.dao';
import * as bcrypt from 'bcrypt';
import { Users } from 'src/entities';

@Injectable()
export class UsersService {
  constructor(private readonly userDao: UsersDao) {}

  async signUp(userSignupDto: UserSignUpDto): Promise<Users> {
    const { email, password, nickname } = userSignupDto;

    const userByEmail = await this.userDao.findByEmail(email);
    if (userByEmail) {
      throw new BadRequestException(errorMsg.EMAIL_EXISTS);
    }

    const userByNickname = await this.userDao.findByNickname(nickname);
    if (userByNickname) {
      throw new BadRequestException(errorMsg.NICKNAME_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(
      password,
      parseInt(process.env.PASSWORD_HASH_SALT),
    );

    const toSaveUser = { email, password: hashedPassword, nickname };

    return await this.userDao.saveUser(toSaveUser);
  }
}
