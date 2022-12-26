import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Cameras, Companies, Lenses } from 'src/entities';
import { CamerasService } from './cameras.service';

@ApiTags('카메라 관련 API')
@Controller('')
export class CamerasController {
  constructor(private readonly camerasService: CamerasService) {}

  @ApiOperation({
    summary: '카메라 가져오기',
  })
  @Get('companies/:companyId/cameras')
  async readCameras(
    @Param('companyId', ParseIntPipe) companyId: number,
  ): Promise<Cameras[]> {
    return await this.camerasService.readCameras(companyId);
  }

  @ApiOperation({
    summary: '렌즈 가져오기',
  })
  @Get('companies/:companyId/lenses')
  async readLenses(
    @Param('companyId', ParseIntPipe) companyId: number,
  ): Promise<Lenses[]> {
    return await this.camerasService.readCameras(companyId);
  }

  @ApiOperation({
    summary: '회사 가져오기',
  })
  @Get('companies')
  async readCompanies(): Promise<Companies[]> {
    return await this.camerasService.readCompanies();
  }
}
