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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvailabilityService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const business_hours_schema_1 = require("../availability/schemas/business-hours.schema");
const staff_availability_schema_1 = require("../availability/schemas/staff-availability.schema");
let AvailabilityService = class AvailabilityService {
    constructor(businessHoursModel, staffAvailabilityModel) {
        this.businessHoursModel = businessHoursModel;
        this.staffAvailabilityModel = staffAvailabilityModel;
    }
    async getAvailableSlots(dto) {
        var _a, _b;
        const businessHours = await this.getBusinessHours(dto.businessId, dto.date);
        if (!businessHours || businessHours.length === 0) {
            return [];
        }
        const service = await this.getServiceDetails(dto.serviceId);
        const requiredStaff = ((_b = (_a = service === null || service === void 0 ? void 0 : service.teamMembers) === null || _a === void 0 ? void 0 : _a.selectedMembers) === null || _b === void 0 ? void 0 : _b.map(m => m.id)) || [];
        const staffAvailability = await this.getStaffAvailability(dto.businessId, requiredStaff, dto.date);
        return this.generateAvailableSlots(businessHours, staffAvailability, dto.duration);
    }
    async checkSlotAvailability(dto) {
        var _a, _b;
        const endTime = this.addMinutesToTime(dto.startTime, dto.duration);
        const isWithinBusinessHours = await this.isWithinBusinessHours(dto.businessId, dto.date, dto.startTime, endTime);
        if (!isWithinBusinessHours)
            return false;
        const service = await this.getServiceDetails(dto.serviceId);
        const requiredStaff = ((_b = (_a = service === null || service === void 0 ? void 0 : service.teamMembers) === null || _a === void 0 ? void 0 : _a.selectedMembers) === null || _b === void 0 ? void 0 : _b.map(m => m.id)) || [];
        const staffAvailable = await this.checkStaffAvailability(requiredStaff, dto.date, dto.startTime, endTime);
        return staffAvailable;
    }
    async createStaffAvailability(dto) {
        const existingAvailability = await this.staffAvailabilityModel.findOne({
            staffId: new mongoose_2.Types.ObjectId(dto.staffId),
            date: new Date(dto.date.getFullYear(), dto.date.getMonth(), dto.date.getDate())
        });
        if (existingAvailability) {
            existingAvailability.availableSlots = dto.availableSlots;
            existingAvailability.updatedAt = new Date();
            return await existingAvailability.save();
        }
        const availability = new this.staffAvailabilityModel({
            staffId: new mongoose_2.Types.ObjectId(dto.staffId),
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            date: new Date(dto.date.getFullYear(), dto.date.getMonth(), dto.date.getDate()),
            availableSlots: dto.availableSlots,
            createdBy: new mongoose_2.Types.ObjectId(dto.createdBy)
        });
        return await availability.save();
    }
    async blockStaffTime(dto) {
        const availability = await this.staffAvailabilityModel.findOne({
            staffId: new mongoose_2.Types.ObjectId(dto.staffId),
            date: new Date(dto.date.getFullYear(), dto.date.getMonth(), dto.date.getDate())
        });
        if (!availability) {
            throw new common_1.BadRequestException('Staff availability not found');
        }
        availability.blockedSlots.push({
            startTime: dto.startTime,
            endTime: dto.endTime,
            isBreak: false
        });
        availability.reason = dto.reason;
        await availability.save();
    }
    async getBusinessHours(businessId, date) {
        const businessHours = await this.businessHoursModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId)
        });
        if (!businessHours)
            return [];
        const isHoliday = businessHours.holidays.some(holiday => holiday.toDateString() === date.toDateString());
        if (isHoliday)
            return [];
        const dayOfWeek = date.getDay();
        const daySchedule = businessHours.weeklySchedule.find(schedule => schedule.dayOfWeek === dayOfWeek);
        if (!daySchedule || !daySchedule.isOpen)
            return [];
        return daySchedule.timeSlots.filter(slot => !slot.isBreak);
    }
    async getStaffAvailability(businessId, staffIds, date) {
        return await this.staffAvailabilityModel.find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            staffId: { $in: staffIds },
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            status: { $ne: 'unavailable' }
        });
    }
    generateAvailableSlots(businessHours, staffAvailability, duration) {
        const slots = [];
        for (const businessHour of businessHours) {
            const startMinutes = this.timeToMinutes(businessHour.startTime);
            const endMinutes = this.timeToMinutes(businessHour.endTime);
            for (let currentMinutes = startMinutes; currentMinutes + duration <= endMinutes; currentMinutes += 30) {
                const slotStart = this.minutesToTime(currentMinutes);
                const slotEnd = this.minutesToTime(currentMinutes + duration);
                const availableStaff = this.getAvailableStaffForSlot(staffAvailability, slotStart, slotEnd);
                if (availableStaff.length > 0) {
                    slots.push({
                        startTime: slotStart,
                        endTime: slotEnd,
                        duration,
                        availableStaff,
                        availableResources: [],
                        isBookable: true
                    });
                }
            }
        }
        return slots;
    }
    getAvailableStaffForSlot(staffAvailability, startTime, endTime) {
        return staffAvailability
            .filter(availability => this.isTimeSlotAvailable(availability.availableSlots, startTime, endTime) &&
            !this.isTimeSlotBlocked(availability.blockedSlots, startTime, endTime))
            .map(availability => availability.staffId);
    }
    isTimeSlotAvailable(availableSlots, startTime, endTime) {
        return availableSlots.some(slot => slot.startTime <= startTime && slot.endTime >= endTime);
    }
    isTimeSlotBlocked(blockedSlots, startTime, endTime) {
        return blockedSlots.some(slot => !(slot.endTime <= startTime || slot.startTime >= endTime));
    }
    async isWithinBusinessHours(businessId, date, startTime, endTime) {
        const businessHours = await this.getBusinessHours(businessId, date);
        return businessHours.some(hours => hours.startTime <= startTime && hours.endTime >= endTime);
    }
    async checkStaffAvailability(staffIds, date, startTime, endTime) {
        if (staffIds.length === 0)
            return true;
        const availability = await this.staffAvailabilityModel.find({
            staffId: { $in: staffIds },
            date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            status: { $ne: 'unavailable' }
        });
        return availability.length >= staffIds.length &&
            availability.every(avail => this.isTimeSlotAvailable(avail.availableSlots, startTime, endTime) &&
                !this.isTimeSlotBlocked(avail.blockedSlots, startTime, endTime));
    }
    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    minutesToTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    }
    addMinutesToTime(time, minutesToAdd) {
        const totalMinutes = this.timeToMinutes(time) + minutesToAdd;
        return this.minutesToTime(totalMinutes);
    }
    async getServiceDetails(serviceId) {
        return {
            teamMembers: {
                allTeamMembers: false,
                selectedMembers: [{ id: new mongoose_2.Types.ObjectId() }]
            }
        };
    }
};
AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(business_hours_schema_1.BusinessHours.name)),
    __param(1, (0, mongoose_1.InjectModel)(staff_availability_schema_1.StaffAvailability.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], AvailabilityService);
exports.AvailabilityService = AvailabilityService;
//# sourceMappingURL=availability.service.js.map