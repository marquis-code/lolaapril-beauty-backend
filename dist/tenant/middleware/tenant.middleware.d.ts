import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../tenant.service';
declare global {
    namespace Express {
        interface Request {
            tenant?: {
                businessId: string;
                subdomain: string;
                business: any;
                config: any;
                limits?: any;
            };
        }
    }
}
export declare class TenantMiddleware implements NestMiddleware {
    private tenantService;
    private readonly logger;
    constructor(tenantService: TenantService);
    use(req: Request, res: Response, next: NextFunction): Promise<void | Response<any, Record<string, any>>>;
    private extractSubdomain;
    private extractSubdomainFromHost;
    private setTenantHeaders;
    private shouldSkipTenantResolution;
}
