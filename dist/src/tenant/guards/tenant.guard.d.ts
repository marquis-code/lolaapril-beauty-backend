import { CanActivate, ExecutionContext } from '@nestjs/common';
import { TenantService } from '../tenant.service';
export declare class TenantGuard implements CanActivate {
    private tenantService;
    private readonly logger;
    constructor(tenantService: TenantService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
