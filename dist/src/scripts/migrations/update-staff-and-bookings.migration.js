"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var StaffBookingMigrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffBookingMigrationService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const booking_schema_1 = require("../../booking/schemas/booking.schema");
const staff_schema_1 = require("../../staff/schemas/staff.schema");
const staff_schedule_schema_1 = require("../../staff/schemas/staff-schedule.schema");
const staff_availability_schema_1 = require("../../availability/schemas/staff-availability.schema");
const business_hours_schema_1 = require("../../availability/schemas/business-hours.schema");
let StaffBookingMigrationService = StaffBookingMigrationService_1 = class StaffBookingMigrationService {
    constructor(bookingModel, staffModel, staffScheduleModel, staffAvailabilityModel, businessHoursModel) {
        this.bookingModel = bookingModel;
        this.staffModel = staffModel;
        this.staffScheduleModel = staffScheduleModel;
        this.staffAvailabilityModel = staffAvailabilityModel;
        this.businessHoursModel = businessHoursModel;
        this.logger = new common_1.Logger(StaffBookingMigrationService_1.name);
    }
    async runMigration() {
        this.logger.log('🚀 Starting migration...');
        const errors = [];
        let bookingsUpdated = 0;
        let staffSchedulesCreated = 0;
        let staffAvailabilityCreated = 0;
        let businessHoursUpdated = 0;
        try {
            this.logger.log('📝 Step 1: Removing preferredStaffId from bookings...');
            const bookingUpdateResult = await this.removePreferredStaffFromBookings();
            bookingsUpdated = bookingUpdateResult.modifiedCount;
            this.logger.log(`✅ Updated ${bookingsUpdated} bookings`);
            this.logger.log('📅 Step 2: Creating 24/7 schedules for staff...');
            staffSchedulesCreated = await this.create24x7StaffSchedules();
            this.logger.log(`✅ Created ${staffSchedulesCreated} staff schedules`);
            this.logger.log('📆 Step 3: Creating 90-day availability for all staff...');
            staffAvailabilityCreated = await this.create90DayStaffAvailability();
            this.logger.log(`✅ Created ${staffAvailabilityCreated} availability records`);
            this.logger.log('🏢 Step 4: Updating business hours to 24/7...');
            businessHoursUpdated = await this.updateBusinessHoursTo24x7();
            this.logger.log(`✅ Updated ${businessHoursUpdated} business hours`);
            this.logger.log('✅ Migration completed successfully!');
            return {
                success: true,
                bookingsUpdated,
                staffSchedulesCreated,
                staffAvailabilityCreated,
                businessHoursUpdated,
                errors
            };
        }
        catch (error) {
            this.logger.error(`❌ Migration failed: ${error.message}`);
            errors.push(error.message);
            return {
                success: false,
                bookingsUpdated,
                staffSchedulesCreated,
                staffAvailabilityCreated,
                businessHoursUpdated,
                errors
            };
        }
    }
    async removePreferredStaffFromBookings() {
        try {
            const result = await this.bookingModel.updateMany({}, {
                $unset: {
                    'services.$[].preferredStaffId': ''
                }
            }).exec();
            return result;
        }
        catch (error) {
            this.logger.error(`Failed to remove preferredStaffId: ${error.message}`);
            throw error;
        }
    }
    async create24x7StaffSchedules() {
        let count = 0;
        try {
            const allStaff = await this.staffModel.find({ status: 'active' }).exec();
            for (const staff of allStaff) {
                const existingSchedule = await this.staffScheduleModel.findOne({
                    staffId: staff._id,
                    isDefault24_7: true
                }).exec();
                if (existingSchedule) {
                    this.logger.log(`Staff ${staff.staffId} already has 24/7 schedule, skipping...`);
                    continue;
                }
                await this.staffScheduleModel.updateMany({ staffId: staff._id }, { isActive: false }).exec();
                const weeklySchedule = [];
                for (let day = 0; day <= 6; day++) {
                    weeklySchedule.push({
                        dayOfWeek: day,
                        isWorkingDay: true,
                        workingHours: [{
                                startTime: '00:00',
                                endTime: '23:59',
                                isBreak: false
                            }],
                        breaks: [],
                        maxHoursPerDay: 24
                    });
                }
                await this.staffScheduleModel.create({
                    staffId: staff._id,
                    businessId: staff.businessId,
                    effectiveDate: new Date(),
                    weeklySchedule,
                    scheduleType: '24_7',
                    reason: 'Migration to 24/7 default schedule',
                    isActive: true,
                    isDefault24_7: true,
                    createdBy: staff.userId
                });
                count++;
                this.logger.log(`✅ Created 24/7 schedule for staff ${staff.staffId}`);
            }
            return count;
        }
        catch (error) {
            this.logger.error(`Failed to create staff schedules: ${error.message}`);
            throw error;
        }
    }
    async create90DayStaffAvailability() {
        let count = 0;
        try {
            const allStaff = await this.staffModel.find({ status: 'active' }).exec();
            const today = new Date();
            const endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
            for (const staff of allStaff) {
                for (let currentDate = new Date(today); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
                    const date = new Date(currentDate);
                    const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
                    const existing = await this.staffAvailabilityModel.findOne({
                        staffId: staff._id,
                        date: normalizedDate
                    }).exec();
                    if (existing) {
                        continue;
                    }
                    await this.staffAvailabilityModel.create({
                        staffId: staff._id,
                        businessId: staff.businessId,
                        date: normalizedDate,
                        availableSlots: [{
                                startTime: '00:00',
                                endTime: '23:59',
                                isBreak: false
                            }],
                        blockedSlots: [],
                        status: 'available',
                        createdBy: staff.userId
                    });
                    count++;
                }
                this.logger.log(`✅ Created 90-day availability for staff ${staff.staffId}`);
            }
            return count;
        }
        catch (error) {
            this.logger.error(`Failed to create staff availability: ${error.message}`);
            throw error;
        }
    }
    async updateBusinessHoursTo24x7() {
        let count = 0;
        try {
            const allBusinessHours = await this.businessHoursModel.find({}).exec();
            for (const businessHour of allBusinessHours) {
                businessHour.operates24x7 = true;
                businessHour.weeklySchedule = [];
                for (let day = 0; day <= 6; day++) {
                    businessHour.weeklySchedule.push({
                        dayOfWeek: day,
                        isOpen: true,
                        is24Hours: true,
                        timeSlots: [{
                                startTime: '00:00',
                                endTime: '23:59',
                                isBreak: false
                            }]
                    });
                }
                await businessHour.save();
                count++;
                this.logger.log(`✅ Updated business hours to 24/7 for business ${businessHour.businessId}`);
            }
            return count;
        }
        catch (error) {
            this.logger.error(`Failed to update business hours: ${error.message}`);
            throw error;
        }
    }
    async rollback() {
        this.logger.warn('⚠️ Starting migration rollback...');
        try {
            this.logger.warn('Rollback not implemented - migration changes are permanent');
        }
        catch (error) {
            this.logger.error(`Rollback failed: ${error.message}`);
            throw error;
        }
    }
};
StaffBookingMigrationService = StaffBookingMigrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __param(1, (0, mongoose_1.InjectModel)(staff_schema_1.Staff.name)),
    __param(2, (0, mongoose_1.InjectModel)(staff_schedule_schema_1.StaffSchedule.name)),
    __param(3, (0, mongoose_1.InjectModel)(staff_availability_schema_1.StaffAvailability.name)),
    __param(4, (0, mongoose_1.InjectModel)(business_hours_schema_1.BusinessHours.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], StaffBookingMigrationService);
exports.StaffBookingMigrationService = StaffBookingMigrationService;
//# sourceMappingURL=update-staff-and-bookings.migration.js.map