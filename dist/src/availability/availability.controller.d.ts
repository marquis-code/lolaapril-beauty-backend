import { AvailabilityService } from '../availability/availability.service';
import { CreateStaffAvailabilityDto } from '../availability/dto/create-staff-availability.dto';
import { CheckAvailabilityDto } from '../availability/dto/check-availability.dto';
import { GetAvailableSlotsDto } from '../availability/dto/get-available-slots.dto';
import { BlockStaffTimeDto } from '../availability/dto/block-staff-time.dto';
export declare class AvailabilityController {
    private readonly availabilityService;
    constructor(availabilityService: AvailabilityService);
    getAvailableSlots(dto: GetAvailableSlotsDto): Promise<{
        success: boolean;
        data: import("../availability/availability.service").AvailabilitySlot[];
    }>;
    checkSlotAvailability(dto: CheckAvailabilityDto): Promise<{
        success: boolean;
        data: {
            isAvailable: boolean;
        };
    }>;
    createStaffAvailability(dto: CreateStaffAvailabilityDto): Promise<{
        success: boolean;
        data: import("./schemas/staff-availability.schema").StaffAvailabilityDocument;
        message: string;
    }>;
    blockStaffTime(dto: BlockStaffTimeDto): Promise<{
        success: boolean;
        message: string;
    }>;
}
