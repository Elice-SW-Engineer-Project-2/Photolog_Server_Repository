import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class UpdatePostDto {
  userId?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  content: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  imageUrlId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  lensId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  cameraId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  latitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  longitude: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  locationInfo: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDateString()
  takenAt: Date;

  @ApiProperty()
  @IsNotEmpty()
  @ArrayUnique()
  hashtags: string[];
}
