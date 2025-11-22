import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
export declare class SubdomainRedirectMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction): void;
    private isMainDomain;
    private isApiRoute;
}
