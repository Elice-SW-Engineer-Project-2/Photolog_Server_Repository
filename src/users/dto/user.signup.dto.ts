import { Users } from 'src/entities';
import { IsNotEmpty, IsString, Length } from 'class-validator';
import { PickType } from '@nestjs/swagger';

export class UserSignUpDto extends PickType(Users, [
  'email',
  'nickname',
] as const) {
  @IsString()
  @IsNotEmpty()
  @Length(8, 16)
  password: string;
}
