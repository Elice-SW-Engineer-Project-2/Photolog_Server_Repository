import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { S3 } from 'aws-sdk';
import { s3 } from 'src/common/aws/s3';
import { plainNumberToMegabyte } from 'src/common/utils/plainNumberToMegabyte';
import { ImageUrl } from 'src/entities';
import { Repository } from 'typeorm';
import { v4 as uuid } from 'uuid';
import { PhotoUploadDto } from './dto/photo.upload.dto';

@Injectable()
export class PhotosService {
  constructor(
    @InjectRepository(ImageUrl)
    private readonly imageUrlRepository: Repository<ImageUrl>,
  ) {}
  presignedUrl(fileExtention: string): S3.PresignedPost {
    const fileName = `original/${uuid()}.${fileExtention}`;
    const presignedUrlExpires: number = parseInt(
      process.env.S3_PRESIGNED_EXPIRES,
    );

    const imageLimitCapacity: number = plainNumberToMegabyte(
      parseInt(process.env.S3_IMAGE_LIMIT_CAPA),
    );

    const params: S3.PresignedPost.Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Fields: { key: fileName },
      Expires: presignedUrlExpires,
      Conditions: [['content-length-range', 0, imageLimitCapacity]],
    };

    return s3.createPresignedPost(params);
  }

  async uploadPhotoUrl(photoUploadDto: PhotoUploadDto) {
    const { url } = photoUploadDto;
    return await this.imageUrlRepository.save({ url });
  }
}
