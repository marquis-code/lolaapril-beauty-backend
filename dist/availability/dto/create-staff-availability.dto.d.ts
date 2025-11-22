import { TimeSlot } from '../schemas/business-hours.schema';
export declare class CreateStaffAvailabilityDto {
    staffId: string;
    businessId: string;
    date: Date;
    availableSlots: TimeSlot[];
    reason?: string;
    createdBy: string;
}
