import {
  Controller,
  Get,
  Post,
  UseGuards,
  Body,
  Res,
  Req,
} from '@nestjs/common';
import { AuthService } from './auth.service';
// import { LocalAuthGuard } from './local-auth.guard';
import { Request, Response } from 'express';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dtos/auth.dto';

import * as jwt from 'jsonwebtoken';

@Controller('/auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: AuthDto, @Res() res: Response): Promise<any> {
    return await this.authService.login(body, res);
  }
  @Post('logout')
  async logout(@Res() res: Response): Promise<any> {
    return await this.authService.logout(res);
  }

  @Get('renewAccessToken')
  async renewAccessToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    return this.authService.renewAccessToken(req, res);
  }

  @Get('verifyAccessToken')
  async verifyAccessToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    console.log('controller');
    return this.authService.verifyAccessToken(req, res);
  }
}
