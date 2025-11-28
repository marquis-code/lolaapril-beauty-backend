import { NestMiddleware, OnModuleInit } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import { TenantRequest } from './tenant.middleware';
export declare class TenantRateLimitMiddleware implements NestMiddleware, OnModuleInit {
    private readonly logger;
    private limiters;
    private planLimiters;
    private defaultLimiter;
    onModuleInit(): void;
    use(req: TenantRequest, res: Response, next: NextFunction): unknown;
    private createLimiterForPlan;
}
