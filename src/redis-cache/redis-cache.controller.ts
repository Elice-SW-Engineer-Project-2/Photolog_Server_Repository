import { Controller, Get } from '@nestjs/common';
import { RedisCacheService } from './redis-cache.service';
@Controller('redis-cache')
export class RedisCacheController {
  constructor(private readonly redisCacheService: RedisCacheService) {}

  @Get('test')
  async getHello(): Promise<string> {
    return this.redisCacheService.getHello();
  }

  @Get('newtest')
  async doTest(): Promise<string> {
    return this.redisCacheService.test();
  }
}
