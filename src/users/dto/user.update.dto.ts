import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  password: string;
}
