import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  UseFilters,
  Param,
  Get,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
import { HttpExceptionFilter } from 'src/common/exceptions/httpException.filter';
import { UserSignUpDto } from './dto/user.signup.dto';
import { UserUpdateDto } from './dto/user.update.dto';
import { UsersService } from './users.service';
import { CurrentUser } from 'src/comments/decorators/user.decorator';
@ApiTags('유저 API')
@Controller('users')
@UseFilters(HttpExceptionFilter)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Get('test')
  guardTest(@CurrentUser() user) {
    return user;
  }
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
    return this.usersService.signUp(userSignUpDto);
  }

  @Get('/:id')
  async getUser(@Param() id: number) {
    return this.usersService.findById(id);
  }

  @Patch('/:id')
  async updateUser(@Param() id: number, @Body() user: UserUpdateDto) {
    return this.usersService.updateUserPassword(id, user);
  }

  @Delete('/:id')
  async deleteUser(@Param() id: number) {
    return this.usersService.deleteUser(id);
  }
}
