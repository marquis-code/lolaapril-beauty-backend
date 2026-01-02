// rate-limiter/rate-limiter.module.ts
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { RateLimiterGuard } from './rate-limiter.guard';
import { CacheModule } from '../cache/cache.module';

@Module({
  imports: [CacheModule],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RateLimiterGuard,
    },
  ],
})
export class RateLimiterModule {}
