import { AvailabilityService } from './availability.service';
import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { BlockStaffTimeDto } from './dto/block-staff-time.dto';
import { GetAllSlotsDto } from "./dto/get-all-slots.dto";
import { UserRole } from '../auth/schemas/user.schema';
import type { BusinessContext as BusinessCtx } from '../auth/decorators/business-context.decorator';
import type { RequestWithUser } from '../auth/types/request-with-user.interface';
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    getAvailableSlots(dto: GetAvailableSlotsDto, businessId?: string): Promise<{
        success: boolean;
        data: import("./availability.service").AvailabilitySlot[];
    }>;
    checkSlotAvailability(dto: CheckAvailabilityDto): Promise<{
        success: boolean;
        data: {
            isAvailable: boolean;
        };
    }>;
    getAllSlots(dto: GetAllSlotsDto, businessId?: string): Promise<{
        success: boolean;
        data: {
            dateRange: {
                start: string;
                end: string;
            };
            slots: {
                date: string;
                hasSlots: boolean;
                availableSlotCount: number;
                takenSlotCount: number;
                totalSlots: number;
                staffAvailable: number;
            }[];
            summary: {
                totalDates: number;
                datesWithAvailability: number;
                datesFullyBooked: number;
            };
        };
    }>;
    createMyAvailability(context: BusinessCtx, dto: Omit<CreateStaffAvailabilityDto, 'businessId' | 'staffId' | 'createdBy'>): Promise<{
        success: boolean;
        data: import("./schemas/staff-availability.schema").StaffAvailabilityDocument;
        message: string;
    }>;
    blockMyTime(context: BusinessCtx, dto: Omit<BlockStaffTimeDto, 'businessId' | 'staffId'>): Promise<{
        success: boolean;
        message: string;
    }>;
    createStaffAvailability(context: BusinessCtx, dto: Omit<CreateStaffAvailabilityDto, 'businessId' | 'createdBy'>): Promise<{
        success: boolean;
        data: import("./schemas/staff-availability.schema").StaffAvailabilityDocument;
        message: string;
    }>;
    blockStaffTime(context: BusinessCtx, dto: Omit<BlockStaffTimeDto, 'businessId'>): Promise<{
        success: boolean;
        message: string;
    }>;
    createSimpleBusinessHours(context: BusinessCtx, dto: {
        operates24x7?: boolean;
        weeklySchedule?: Array<{
            dayOfWeek: number;
            isOpen: boolean;
            timeSlots: Array<{
                startTime: string;
                endTime: string;
            }>;
        }>;
    }): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    createBusinessHours(businessId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    createBusinessHours24x7(businessId: string): Promise<{
        success: boolean;
        data: any;
        message: string;
    }>;
    extendStaffAvailability(context: BusinessCtx, dto: {
        staffId?: string;
        daysAhead?: number;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    initializeBusiness(context: BusinessCtx, dto: {
        staffIds: string[];
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    private getDefaultWeeklySchedule;
    setupAvailability(user: RequestWithUser['user'], dto: {
        businessId: string;
        staffIds: string[];
        startDate: string;
        endDate: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    checkFullyBooked(dto: {
        businessId: string;
        date: string;
        startTime: string;
        duration: number;
        bufferTime?: number;
    }): Promise<{
        success: boolean;
        data: {
            isFullyBooked: boolean;
            availableStaffCount: number;
            totalStaffCount: number;
            message: string;
            availableStaff?: {
                staffId: string;
                staffName: string;
                currentWorkload: number;
            }[];
        };
    }>;
    getDetailedSlots(user: RequestWithUser['user'] | undefined, dto: GetAvailableSlotsDto): Promise<{
        success: boolean;
        data: import("./availability.service").AvailabilitySlot[];
        userContext: {
            isAuthenticated: boolean;
            role: UserRole;
            businessId: string;
        } | {
            isAuthenticated: boolean;
            role?: undefined;
            businessId?: undefined;
        };
    }>;
}
