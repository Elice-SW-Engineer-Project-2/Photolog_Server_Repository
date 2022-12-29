import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Query,
  UseFilters,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/httpException.filter';
import { PhotoUploadDto } from './dto/photo.upload.dto';
import { PresignedUrlDto } from './dto/presigned-url.dto';
import { PhotosService } from './photos.service';

@ApiTags('이미지 업로드')
@Controller('api/photos')
@UseFilters(HttpExceptionFilter)
export class PhotosController {
  constructor(private readonly photosService: PhotosService) {}

  @ApiOperation({
    summary: 'presignedURL 요청',
    description: 'query 파라미터로 filetype을 입력해서 presignedURL을 요청함',
  })
  @Get('presigned-url')
  @HttpCode(200)
  presignedUrl(@Query() query: PresignedUrlDto) {
    const { filetype } = query;
    return this.photosService.presignedUrl(filetype);
  }

  @ApiOperation({
    summary: '이미지 Url 업로드',
    description: 's3에 업로드된 이미지 url을 db에 저장함',
  })
  @Post()
  async uploadPhotoUrl(@Body() photoUploadDto: PhotoUploadDto) {
    return this.photosService.uploadPhotoUrl(photoUploadDto);
  }
}
