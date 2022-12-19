import { Controller, Get, HttpCode, Query, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/common/exceptions/httpException.filter';
import { PresignedUrlDto } from './dto/presigned-url.dto';
import { PresignedUrlService } from './presigned-url.service';

@ApiTags('이미지 업로드')
@Controller('photos')
@UseFilters(HttpExceptionFilter)
export class PresignedUrlController {
  constructor(private readonly presignedUrlService: PresignedUrlService) {}

  @ApiOperation({
    summary: 'presignedURL 요청',
    description: 'query 파라미터로 filetype을 입력해서 presignedURL을 요청함',
  })
  @Get('presigned-url')
  @HttpCode(200)
  presignedUrl(@Query() query: PresignedUrlDto) {
    const { filetype } = query;
    return this.presignedUrlService.presignedUrl(filetype);
  }
}
