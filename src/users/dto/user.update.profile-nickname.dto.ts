import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserProfileNicknameUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  nickname: string;
}
