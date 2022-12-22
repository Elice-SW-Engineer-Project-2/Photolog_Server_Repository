import { Profile, Users } from 'src/entities';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

export class UserUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  password: string;
}
