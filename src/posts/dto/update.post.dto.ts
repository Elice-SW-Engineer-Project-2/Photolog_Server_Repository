import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdatePostDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  imageUrlId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  lensId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  cameraId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty()
  longitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  locationInfo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  @ApiProperty()
  takenAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @ArrayUnique()
  @ApiProperty()
  hashtags: string[];
}
