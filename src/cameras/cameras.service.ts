import { BadRequestException, Injectable, Logger } from '@nestjs/common';
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
    try {
      return await this.camerasRepository.findBy({ companyId });
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async readLenses(companyId: number): Promise<Lenses[]> {
    try {
      return await this.lensesRepository.findBy({ companyId });
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async readCameraCompanies(): Promise<Companies[]> {
    try {
      const foundCompanyId: Cameras[] = await this.camerasRepository
        .createQueryBuilder()
        .select('companyId')
        .distinct(true)
        .execute();
      const compaiesToFind: { id: number }[] = foundCompanyId.map(
        (item: Cameras) => ({
          id: item.companyId,
        }),
      );
      const foundCompanies: Companies[] = await this.companiesRepository.findBy(
        compaiesToFind,
      );
      const additionalOption = {
        id: null,
        name: '없음',
      } as Companies;

      return [...foundCompanies, additionalOption];
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }

  async readLensCompanies(): Promise<Companies[]> {
    try {
      const foundCompanyId: Lenses[] = await this.lensesRepository
        .createQueryBuilder()
        .select('companyId')
        .distinct(true)
        .execute();
      const compaiesToFind: { id: number }[] = foundCompanyId.map(
        (item: Lenses) => ({
          id: item.companyId,
        }),
      );
      const foundCompanies: Companies[] = await this.companiesRepository.findBy(
        compaiesToFind,
      );
      const additionalOption = {
        id: null,
        name: '없음',
      } as Companies;

      return [...foundCompanies, additionalOption];
    } catch (error) {
      Logger.error(error);
      throw new BadRequestException(error);
    }
  }
}
