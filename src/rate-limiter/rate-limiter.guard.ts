// rate-limiter/rate-limiter.guard.ts
import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheService } from '../cache/cache.service';

@Injectable()
export class RateLimiterGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private cacheService: CacheService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const ip = request.ip;
    const endpoint = request.route.path;

    // Get rate limit config from decorator or use defaults
    const limit = this.reflector.get<number>('rateLimit', context.getHandler()) || 100;
    const ttl = this.reflector.get<number>('rateLimitTTL', context.getHandler()) || 60;

    const key = `rate_limit:${ip}:${endpoint}`;
    const count = await this.cacheService.incrementCounter(key, ttl);

    if (count > limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Please try again later.',
          retryAfter: ttl,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Add rate limit headers
    const response = context.switchToHttp().getResponse();
    response.setHeader('X-RateLimit-Limit', limit);
    response.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count));
    response.setHeader('X-RateLimit-Reset', new Date(Date.now() + ttl * 1000).toISOString());

    return true;
  }
}
