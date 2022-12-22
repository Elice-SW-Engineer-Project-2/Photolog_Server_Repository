import { Module, CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheService } from './redis-cache.service';
import { RedisCacheController } from './redis-cache.controller';

const cacheModule = CacheModule.register({
  useFactory: async () => ({
    store: redisStore,
    host: 'localhost',
    port: 6379,
    password: process.env.REDIS_PASSWORD,
    til: 0,
  }),
});

@Module({
  imports: [cacheModule],
  providers: [RedisCacheService],
  controllers: [RedisCacheController],
  exports: [RedisCacheService],
})
export class RedisCacheModule {}
