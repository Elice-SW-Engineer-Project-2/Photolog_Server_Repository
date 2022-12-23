import { Controller, Get, Post, Body, Res, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import { AuthDto } from './dtos/auth.dto';

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
    return await this.authService.renewAccessToken(req, res);
  }

  @Get('verifyAccessToken')
  async verifyAccessToken(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<any> {
    console.log('controller');
    return this.authService.verifyAccessToken(req, res);
  }

  // @Post('renewPassword')
  // async renewPassword(@Req() req: Request, @Res() res: Response): Promise<any> {
  //   return this.authService.renewPassword(req, res);
  // }
}
