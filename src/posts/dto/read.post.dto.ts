import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class ReadPostDto {
  @ApiProperty({
    description: '화면에 나온 마지막 postId, default : 최신게시글',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  endPostId: number | null = null;

  @ApiProperty({
    description: 'endPostId부터 가져올 게시글 수, default : 10',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => Number.parseInt(value))
  quantity: number = 10;
}
