import {
  Controller,
  Param /*UseGuards */,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { /*Post,*/ Get /*, Body*/ } from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/user.decorator';
// import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
// import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Profile } from 'src/entities';
import { UsersService } from 'src/users/users.service';
import { ProfilesService } from './profiles.service';
import { UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('Authorization')
  @Put('image/:imageUrlId')
  async changeProfileImage(
    @CurrentUser() user,
    @Param('imageUrlId', ParseIntPipe) imageUrlId: number,
  ) {
    return this.profilesService.changeProfileImage(user.id, imageUrlId);
  }

  @Get('/:userId')
  async getProfile(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<Profile> {
    return this.profilesService.getProfile(userId);
  }
}
