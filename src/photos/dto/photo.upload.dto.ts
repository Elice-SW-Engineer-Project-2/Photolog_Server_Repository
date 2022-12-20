import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

export class PhotoUploadDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsUrl()
  url: string;
}
