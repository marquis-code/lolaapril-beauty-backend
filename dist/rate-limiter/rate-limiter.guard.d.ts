import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { CacheService } from '../cache/cache.service';
export declare class RateLimiterGuard implements CanActivate {
    private reflector;
    private cacheService;
    constructor(reflector: Reflector, cacheService: CacheService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
