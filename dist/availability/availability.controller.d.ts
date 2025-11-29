import { AvailabilityService } from './availability.service';
import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { BlockStaffTimeDto } from './dto/block-staff-time.dto';
import { TenantRequest } from '../tenant/middleware/tenant.middleware';
import { GetAllSlotsDto } from "./dto/get-all-slots.dto";
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    getAvailableSlots(dto: GetAvailableSlotsDto, req: TenantRequest): Promise<{
        success: boolean;
        data: import("./availability.service").AvailabilitySlot[];
    }>;
    checkSlotAvailability(dto: CheckAvailabilityDto, req: TenantRequest): Promise<{
        success: boolean;
        data: {
            isAvailable: boolean;
        };
    }>;
    createStaffAvailability(dto: CreateStaffAvailabilityDto, req: TenantRequest): Promise<{
        success: boolean;
        data: import("./schemas/staff-availability.schema").StaffAvailabilityDocument;
        message: string;
    }>;
    blockStaffTime(dto: BlockStaffTimeDto, req: TenantRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    getAllSlots(dto: GetAllSlotsDto, req: TenantRequest): Promise<{
        success: boolean;
        data: {
            date: string;
            dayOfWeek: string;
            businessHours: import("./schemas/business-hours.schema").TimeSlot[];
            staffAvailability: {
                staffId: string;
                staffName: string;
                email: string;
                availableSlots: import("./schemas/business-hours.schema").TimeSlot[];
                blockedSlots: import("./schemas/business-hours.schema").TimeSlot[];
                status: string;
            }[];
        }[];
    }>;
    createBusinessHours(businessId: string): Promise<any>;
    setupAvailability(dto: {
        businessId: string;
        staffIds: string[];
        startDate: string;
        endDate: string;
        createdBy: string;
    }): Promise<{
        message: string;
    }>;
    createBusinessHours24x7(businessId: string): Promise<any>;
    checkFullyBooked(dto: {
        businessId: string;
        date: string;
        startTime: string;
        duration: number;
        bufferTime?: number;
    }): Promise<{
        isFullyBooked: boolean;
        availableStaffCount: number;
        totalStaffCount: number;
        message: string;
        availableStaff?: {
            staffId: string;
            staffName: string;
            currentWorkload: number;
        }[];
    }>;
    extendStaffAvailability(dto: {
        businessId: string;
        staffId?: string;
        daysAhead?: number;
    }, req: TenantRequest): Promise<{
        success: boolean;
        message: string;
    }>;
    initializeBusiness(dto: {
        businessId: string;
        staffIds: string[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
