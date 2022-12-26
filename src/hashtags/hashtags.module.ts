import { Module } from '@nestjs/common';
import { HashtagsService } from './hashtags.service';
import { HashtagsController } from './hashtags.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hashtags, Tags } from 'src/entities';

@Module({
  imports: [TypeOrmModule.forFeature([Hashtags, Tags])],
  controllers: [HashtagsController],
  providers: [HashtagsService],
})
export class HashtagsModule {}
