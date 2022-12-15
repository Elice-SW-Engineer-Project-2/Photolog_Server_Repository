import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities';
import { Repository } from 'typeorm';

import { UserSignUpDto } from './dto/user.signup.dto';

@Injectable()
export class UsersDao {
  constructor(
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async findByEmail(email: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByNickname(nickname: string): Promise<Users> {
    return this.usersRepository.findOne({ where: { nickname } });
  }

  async saveUser(toSaveUser: UserSignUpDto): Promise<Users> {
    return this.usersRepository.save(toSaveUser);
  }
}
