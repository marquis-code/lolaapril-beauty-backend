import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class TenantRateLimitMiddleware implements NestMiddleware {
    private limiters;
    use(req: Request, res: Response, next: NextFunction): void;
    private createTenantLimiter;
}
