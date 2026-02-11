import { Model, Types } from 'mongoose';
import { BusinessHours, BusinessHoursDocument } from './schemas/business-hours.schema';
import { StaffAvailabilityDocument } from './schemas/staff-availability.schema';
import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto';
import { CheckAvailabilityDto } from './dto/check-availability.dto';
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto';
import { BusinessDocument } from '../business/schemas/business.schema';
import { AppointmentDocument } from '../appointment/schemas/appointment.schema';
import { BlockStaffTimeDto } from './dto/block-staff-time.dto';
import { GetAllSlotsDto } from "./dto/get-all-slots.dto";
import { BookingService } from '../booking/services/booking.service';
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
    private businessModel;
    private appointmentModel;
    private bookingService;
    constructor(businessHoursModel: Model<BusinessHoursDocument>, staffAvailabilityModel: Model<StaffAvailabilityDocument>, businessModel: Model<BusinessDocument>, appointmentModel: Model<AppointmentDocument>, bookingService: BookingService);
    getAvailableSlots(dto: GetAvailableSlotsDto, authenticatedBusinessId?: string): Promise<AvailabilitySlot[]>;
    private generateSlotsFromBusinessHours;
    private checkSlotsAgainstBookings;
    createCustomBusinessHours(businessId: string, weeklySchedule: Array<{
        dayOfWeek: number;
        isOpen: boolean;
        timeSlots: Array<{
            startTime: string;
            endTime: string;
        }>;
    }>): Promise<BusinessHours>;
    private generateAvailableSlotsBusinessFirst;
    private getServicesByIds;
    private calculateTotalDuration;
    private getEligibleStaffForServices;
    checkMultiServiceAvailability(dto: {
        businessId: string;
        date: string;
        startTime: string;
        serviceIds: string[];
        bookingType?: 'sequential' | 'parallel';
        bufferTime?: number;
    }): Promise<{
        isAvailable: boolean;
        totalDuration: number;
        endTime: string;
        availableStaffCount: number;
        services: Array<{
            serviceId: string;
            serviceName: string;
            startTime: string;
            endTime: string;
        }>;
    }>;
    private buildServiceTimeline;
    createStaffAvailability(dto: CreateStaffAvailabilityDto): Promise<StaffAvailabilityDocument>;
    blockStaffTime(dto: BlockStaffTimeDto): Promise<void>;
    getAllSlots(dto: GetAllSlotsDto, authenticatedBusinessId?: string): Promise<{
        dateRange: {
            start: string;
            end: string;
        };
        slots: Array<{
            date: string;
            hasSlots: boolean;
            availableSlotCount: number;
            takenSlotCount: number;
            totalSlots: number;
            staffAvailable: number;
        }>;
        summary: {
            totalDates: number;
            datesWithAvailability: number;
            datesFullyBooked: number;
        };
    }>;
    private checkSlotAvailabilityInternal;
    private getDayName;
    private parseDate;
    private normalizeDate;
    private getBusinessHours;
    private getStaffAvailability;
    getAvailableStaffList(dto: {
        businessId: string;
        date: string;
        startTime: string;
        endTime: string;
        serviceId?: string;
    }): Promise<Array<{
        staffId: string;
        staffName: string;
        skillLevel?: string;
        isAvailable: boolean;
    }>>;
    private getAvailableStaffForSlot;
    private generateAvailableSlots;
    private isTimeSlotAvailable;
    private isTimeSlotBlocked;
    private isWithinBusinessHours;
    private checkStaffAvailability;
    private timeToMinutes;
    private minutesToTime;
    private addMinutesToTime;
    private getServiceDetails;
    createBusinessHours(businessId: string): Promise<any>;
    setupAvailabilityForBusiness(businessId: string, staffIds: string[], startDate: string, endDate: string, createdBy: string): Promise<void>;
    createBusinessHours24x7(businessId: string): Promise<any>;
    setupStaffAvailability24x7(businessId: string, staffId: string, startDate: Date, endDate: Date, createdBy: string): Promise<void>;
    autoCreateStaffAvailability(businessId: string, staffId: string, createdBy: string): Promise<void>;
    checkSlotAvailability(dto: CheckAvailabilityDto & {
        bufferTime?: number;
    }): Promise<boolean>;
    isFullyBooked(dto: {
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
        availableStaff?: Array<{
            staffId: string;
            staffName: string;
            currentWorkload: number;
        }>;
    }>;
    isFullyBookedV2(dto: {
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
        availableStaff?: Array<{
            staffId: string;
            staffName: string;
            currentWorkload: number;
        }>;
    }>;
    isFullyBookedV3(dto: {
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
        availableStaff?: Array<{
            staffId: string;
            staffName: string;
            currentWorkload: number;
        }>;
    }>;
    checkAvailabilityGap(businessId: string, checkUntilDate: Date): Promise<boolean>;
    deleteOldAvailability(beforeDate: Date): Promise<{
        deletedCount: number;
    }>;
    ensureAllStaffAvailability(businessId: string, daysAhead?: number): Promise<void>;
    ensureStaffAvailabilityExtended(businessId: string, staffId: string, daysAhead?: number): Promise<void>;
}
