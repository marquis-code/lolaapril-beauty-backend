import { Model, Types } from 'mongoose';
import { BusinessHoursDocument } from '../availability/schemas/business-hours.schema';
import { StaffAvailabilityDocument } from '../availability/schemas/staff-availability.schema';
import { CreateStaffAvailabilityDto } from '../availability/dto/create-staff-availability.dto';
import { CheckAvailabilityDto } from '../availability/dto/check-availability.dto';
import { GetAvailableSlotsDto } from '../availability/dto/get-available-slots.dto';
import { BlockStaffTimeDto } from '../availability/dto/block-staff-time.dto';
export interface AvailabilitySlot {
    startTime: string;
    endTime: string;
    duration: number;
    availableStaff: Types.ObjectId[];
    availableResources: Types.ObjectId[];
    isBookable: boolean;
}
export declare class AvailabilityService {
    private businessHoursModel;
    private staffAvailabilityModel;
    constructor(businessHoursModel: Model<BusinessHoursDocument>, staffAvailabilityModel: Model<StaffAvailabilityDocument>);
    getAvailableSlots(dto: GetAvailableSlotsDto): Promise<AvailabilitySlot[]>;
    checkSlotAvailability(dto: CheckAvailabilityDto): Promise<boolean>;
    createStaffAvailability(dto: CreateStaffAvailabilityDto): Promise<StaffAvailabilityDocument>;
    blockStaffTime(dto: BlockStaffTimeDto): Promise<void>;
    private getBusinessHours;
    private getStaffAvailability;
    private generateAvailableSlots;
    private getAvailableStaffForSlot;
    private isTimeSlotAvailable;
    private isTimeSlotBlocked;
    private isWithinBusinessHours;
    private checkStaffAvailability;
    private timeToMinutes;
    private minutesToTime;
    private addMinutesToTime;
    private getServiceDetails;
}
