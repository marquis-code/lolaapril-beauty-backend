import { AvailabilityService } from './availability.service';
import { Model } from 'mongoose';
import { BusinessHoursDocument } from './schemas/business-hours.schema';
export declare class AvailabilitySchedulerService {
    private readonly availabilityService;
    private businessHoursModel;
    private readonly logger;
    constructor(availabilityService: AvailabilityService, businessHoursModel: Model<BusinessHoursDocument>);
    extendDailyAvailability(): Promise<void>;
    cleanupOldAvailability(): Promise<void>;
    checkLowAvailability(): Promise<void>;
}
