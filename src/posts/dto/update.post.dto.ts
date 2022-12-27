import { ApiProperty } from '@nestjs/swagger';
import {
  ArrayUnique,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
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
  @IsOptional()
  @IsNumber()
  lensId: number | null;

  @ApiProperty()
  @IsOptional()
  @IsNumber()
  cameraId: number | null;

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
