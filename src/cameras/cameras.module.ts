import { Module } from '@nestjs/common';
import { CamerasService } from './cameras.service';
import { CamerasController } from './cameras.controller';
import { Cameras, Companies, Lenses } from 'src/entities';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Companies, Cameras, Lenses])],
  controllers: [CamerasController],
  providers: [CamerasService],
})
export class CamerasModule {}
