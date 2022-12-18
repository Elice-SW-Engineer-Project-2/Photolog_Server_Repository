import { Body, Controller, Post, Res, UseFilters } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/httpException.filter';
import { UserSignUpDto } from './dto/user.signup.dto';
import { UsersService } from './users.service';

@ApiTags('유저 API')
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // TODO : 직렬화 작동시키기(withoutPassword, deletedAt 객체 응답)
  @ApiOperation({
    summary: '유저 회원가입',
    description:
      '유저의 email과 pasword, nickname을 받아서 회원가입을 처리 함 password : 8자리 이상',
  })
  @ApiOkResponse({
    type: UserSignUpDto,
    status: 200,
    schema: { example: { sk: 1 } },
  }) // TODO : api문서 제대로 작성
  @ApiBearerAuth('Authorization') //인증이 필요한 api인지 확인, 자물쇠로 표시됨
  @ApiUnauthorizedResponse({ status: 401 })
  @Post()
  async signUp(@Body() userSignUpDto: UserSignUpDto): Promise<void> {
    await this.usersService.signUp(userSignUpDto);

    // res.status(201);
  }
}
