import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class PresignedUrlDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  filetype: string;
}
