import { Test, TestingModule } from '@nestjs/testing';
import { RedisCacheController } from './redis-cache.controller';

describe('RedisCacheController', () => {
  let controller: RedisCacheController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RedisCacheController],
    }).compile();

    controller = module.get<RedisCacheController>(RedisCacheController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
