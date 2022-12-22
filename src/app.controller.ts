import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { CACHE_MANAGER, Inject } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/cache')
  async getCache(): Promise<string> {
    const savedTime = await this.cacheManager.get('time');
    if (savedTime) {
      return 'saved time : ' + savedTime;
    }
    const now = new Date().getTime();
    await this.cacheManager.set('time', now);
    return 'save new time : ' + now;
  }
}
