import { Controller, Param /*UseGuards */, Patch, Put } from '@nestjs/common';
import { /*Post,*/ Get /*, Body*/ } from '@nestjs/common';
// import { JwtAuthGuard } from 'src/auth/jwt/jwt.guard';
// import { CurrentUser } from 'src/common/decorators/user.decorator';
import { Profile } from 'src/entities';
import { UsersService } from 'src/users/users.service';
import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profilesService: ProfilesService,
  ) {}
  @Get('/:userId')
  async getProfile(@Param() userId: number): Promise<Profile> {
    return this.profilesService.getProfile(userId);
  }

  // @Put('/image/:userId')
  // async changeProfileImage(@Param() userId: number) {
  //   return this.profilesService.changeProfileImage(userId);
  // }

  //   @UseGuards(JwtAuthGuard)
  //   @Get()
  //   async getUser(@CurrentUser() user) {
  //     return this.findById(user.id);
  //   }
}
