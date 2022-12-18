import { Module } from '@nestjs/common';
import { PresignedUrlService } from './presigned-url.service';
import { PresignedUrlController } from './presigned-url.controller';

@Module({
  controllers: [PresignedUrlController],
  providers: [PresignedUrlService],
  exports: [PresignedUrlService],
})
export class PresignedUrlModule {}
