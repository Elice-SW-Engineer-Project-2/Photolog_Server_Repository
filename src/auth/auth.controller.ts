import {
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  Body,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './local-auth.guard';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dtos/auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: AuthDto): Promise<any> {
    return this.authService.login(body);
  }

  // @Post('refresh')
  // async refreshToken(@Body() body: AuthDto): Promise<any> {
  //   const { email, password } = body;
  //   return this.authService~~~~;
  // }
}
