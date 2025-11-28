import { NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TenantService } from '../tenant.service';
import { Model } from 'mongoose';
import { Booking } from '../../booking/schemas/booking.schema';
export interface TenantRequest extends Request {
    tenant?: {
        businessId: string;
        business: any;
        limits?: any;
    };
    user?: {
        sub: string;
        id: string;
        email: string;
        role: string;
    };
}
export declare class TenantMiddleware implements NestMiddleware {
    private tenantService;
    private bookingModel;
    private readonly logger;
    constructor(tenantService: TenantService, bookingModel: Model<Booking>);
    use(req: TenantRequest, res: Response, next: NextFunction): Promise<void>;
}
