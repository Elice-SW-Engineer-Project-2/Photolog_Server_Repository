import { IsNotEmpty, IsString, IsEmail, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class AuthDto {
  @ApiProperty({
    example: 'gildong@naver.com',
    description: '유저 이메일',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'gildongPASSWORD',
    description: '유저 패스워드',
    required: true,
  })
  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  password: string;
}
