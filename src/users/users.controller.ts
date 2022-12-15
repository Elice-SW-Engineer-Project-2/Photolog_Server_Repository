import { Body, Controller, Post, UseFilters } from '@nestjs/common';
import { HttpExceptionFilter } from 'src/common/exceptions/httpException.filter';
import { UserDTO } from './dto/user.dto';
import { UserSignUpDto } from './dto/user.signup.dto';
import { UsersService } from './users.service';

@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO : 직렬화 작동시키기(withoutPassword, deletedAt 객체 응답)
  @Post()
  async signUp(@Body() userSignUpDto: UserSignUpDto): Promise<UserDTO> {
    return await this.usersService.signUp(userSignUpDto);
  }
}
