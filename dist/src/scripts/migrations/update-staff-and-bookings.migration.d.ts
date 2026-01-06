import { Model } from 'mongoose';
import { Booking } from '../../booking/schemas/booking.schema';
import { Staff } from '../../staff/schemas/staff.schema';
import { StaffSchedule } from '../../staff/schemas/staff-schedule.schema';
import { StaffAvailability } from '../../availability/schemas/staff-availability.schema';
import { BusinessHours } from '../../availability/schemas/business-hours.schema';
export declare class StaffBookingMigrationService {
    private bookingModel;
    private staffModel;
    private staffScheduleModel;
    private staffAvailabilityModel;
    private businessHoursModel;
    private readonly logger;
    constructor(bookingModel: Model<Booking>, staffModel: Model<Staff>, staffScheduleModel: Model<StaffSchedule>, staffAvailabilityModel: Model<StaffAvailability>, businessHoursModel: Model<BusinessHours>);
    runMigration(): Promise<{
        success: boolean;
        bookingsUpdated: number;
        staffSchedulesCreated: number;
        staffAvailabilityCreated: number;
        businessHoursUpdated: number;
        errors: string[];
    }>;
    private removePreferredStaffFromBookings;
    private create24x7StaffSchedules;
    private create90DayStaffAvailability;
    private updateBusinessHoursTo24x7;
    rollback(): Promise<void>;
}
