import { Profile, Users } from 'src/entities';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { ApiProperty, IntersectionType, PickType } from '@nestjs/swagger';

export class UserSignUpDto extends IntersectionType(
  PickType(Profile, ['nickname'] as const),
  PickType(Users, ['email'] as const),
) {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  password: string;
}
