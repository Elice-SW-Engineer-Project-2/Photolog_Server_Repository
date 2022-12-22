import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisCacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}
  async getHello() {
    await this.cacheManager.set('cached_item', { key: 32 });
    const cachedItem = await this.cacheManager.get('cached_item');

    console.log(cachedItem);
    return 'hello World!';
  }
  async test() {
    return await this.get('cached_item');
  }
  async get(key: string): Promise<any> {
    return await this.cacheManager.get(key);
  }

  async set(key: string, value: any, option?: any) {
    return await this.cacheManager.set(key, value, option);
  }

  async reset() {
    await this.cacheManager.reset();
  }

  async del(key: string) {
    await this.cacheManager.del(key);
  }
}
