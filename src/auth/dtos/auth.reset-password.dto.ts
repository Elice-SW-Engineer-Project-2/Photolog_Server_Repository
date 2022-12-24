import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AuthResetPasswordDto {
  @ApiProperty({
    example: 'gildong@naver.com',
    description: '유저 이메일',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
