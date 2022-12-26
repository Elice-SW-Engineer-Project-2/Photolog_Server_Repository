import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Cameras, Companies, Lenses } from 'src/entities';
import { Repository } from 'typeorm';

@Injectable()
export class CamerasService {
  constructor(
    @InjectRepository(Companies)
    private readonly companiesRepository: Repository<Companies>,
    @InjectRepository(Cameras)
    private readonly camerasRepository: Repository<Cameras>,
    @InjectRepository(Lenses)
    private readonly lensesRepository: Repository<Lenses>,
  ) {}

  async readCameras(companyId: number): Promise<Cameras[]> {
    return await this.camerasRepository.findBy({ companyId });
  }

  async readLenses(companyId: number): Promise<Lenses[]> {
    return await this.lensesRepository.findBy({ companyId });
  }

  async readCompanies(): Promise<Companies[]> {
    return await this.companiesRepository.find();
  }
}
