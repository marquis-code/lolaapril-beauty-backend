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
const business_hours_schema_1 = require("./schemas/business-hours.schema");
const staff_availability_schema_1 = require("./schemas/staff-availability.schema");
let AvailabilityService = class AvailabilityService {
    constructor(businessHoursModel, staffAvailabilityModel) {
        this.businessHoursModel = businessHoursModel;
        this.staffAvailabilityModel = staffAvailabilityModel;
    }
    async getAvailableSlots(dto) {
        if (!dto.businessId) {
            throw new common_1.BadRequestException('Business ID is required');
        }
        const date = this.parseDate(dto.date);
        const businessHours = await this.getBusinessHours(dto.businessId, date);
        if (!businessHours || businessHours.length === 0) {
            return [];
        }
        const bufferTime = dto.bufferTime || 0;
        const totalDuration = dto.duration + bufferTime;
        const normalizedDate = this.normalizeDate(date);
        const staffAvailability = await this.staffAvailabilityModel
            .find({
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            date: normalizedDate,
            status: { $ne: 'unavailable' }
        })
            .lean()
            .exec();
        return this.generateAvailableSlots(businessHours, staffAvailability, totalDuration);
    }
    async createStaffAvailability(dto) {
        if (!dto.businessId) {
            throw new common_1.BadRequestException('Business ID is required');
        }
        const date = this.parseDate(dto.date);
        const normalizedDate = this.normalizeDate(date);
        const existingAvailability = await this.staffAvailabilityModel.findOne({
            staffId: new mongoose_2.Types.ObjectId(dto.staffId),
            date: normalizedDate
        }).exec();
        if (existingAvailability) {
            const updated = await this.staffAvailabilityModel
                .findByIdAndUpdate(existingAvailability._id, {
                availableSlots: dto.availableSlots,
                updatedAt: new Date()
            }, { new: true })
                .lean()
                .exec();
            if (!updated) {
                throw new common_1.BadRequestException('Failed to update staff availability');
            }
            return updated;
        }
        const availability = new this.staffAvailabilityModel({
            staffId: new mongoose_2.Types.ObjectId(dto.staffId),
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            date: normalizedDate,
            availableSlots: dto.availableSlots,
            createdBy: new mongoose_2.Types.ObjectId(dto.createdBy)
        });
        await availability.save();
        const saved = await this.staffAvailabilityModel
            .findById(availability._id)
            .lean()
            .exec();
        if (!saved) {
            throw new common_1.BadRequestException('Failed to retrieve saved staff availability');
        }
        return saved;
    }
    async blockStaffTime(dto) {
        if (!dto.businessId) {
            throw new common_1.BadRequestException('Business ID is required');
        }
        const date = this.parseDate(dto.date);
        const normalizedDate = this.normalizeDate(date);
        const availability = await this.staffAvailabilityModel.findOne({
            staffId: new mongoose_2.Types.ObjectId(dto.staffId),
            date: normalizedDate
        }).exec();
        if (!availability) {
            throw new common_1.BadRequestException('Staff availability not found');
        }
        availability.blockedSlots.push({
            startTime: dto.startTime,
            endTime: dto.endTime,
            isBreak: false
        });
        if (dto.reason) {
            availability.reason = dto.reason;
        }
        await availability.save();
    }
    async getAllSlots(dto) {
        if (!dto.businessId) {
            throw new common_1.BadRequestException('Business ID is required');
        }
        const startDate = dto.startDate ? this.parseDate(dto.startDate) : new Date();
        const endDate = dto.endDate
            ? this.parseDate(dto.endDate)
            : new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
        const allSlots = [];
        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const date = new Date(currentDate);
            const normalizedDate = this.normalizeDate(date);
            const businessHours = await this.getBusinessHours(dto.businessId, date);
            const staffQuery = {
                businessId: new mongoose_2.Types.ObjectId(dto.businessId),
                date: normalizedDate
            };
            if (dto.staffId) {
                staffQuery.staffId = new mongoose_2.Types.ObjectId(dto.staffId);
            }
            const staffAvailability = await this.staffAvailabilityModel
                .find(staffQuery)
                .populate('staffId', 'firstName lastName email')
                .exec();
            allSlots.push({
                date: date.toISOString().split('T')[0],
                dayOfWeek: this.getDayName(date.getDay()),
                businessHours: businessHours,
                staffAvailability: staffAvailability.map((avail) => ({
                    staffId: avail.staffId._id.toString(),
                    staffName: `${avail.staffId.firstName} ${avail.staffId.lastName}`,
                    email: avail.staffId.email,
                    availableSlots: avail.availableSlots,
                    blockedSlots: avail.blockedSlots || [],
                    status: avail.status
                }))
            });
        }
        return allSlots;
    }
    getDayName(dayOfWeek) {
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return days[dayOfWeek];
    }
    parseDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
            throw new common_1.BadRequestException('Invalid date format');
        }
        return date;
    }
    normalizeDate(date) {
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    }
    async getBusinessHours(businessId, date) {
        const businessHours = await this.businessHoursModel
            .findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId)
        })
            .lean()
            .exec();
        if (!businessHours)
            return [];
        const normalizedDate = this.normalizeDate(date);
        const isHoliday = businessHours.holidays.some(holiday => this.normalizeDate(new Date(holiday)).getTime() === normalizedDate.getTime());
        if (isHoliday)
            return [];
        const dayOfWeek = date.getDay();
        const daySchedule = businessHours.weeklySchedule.find(schedule => schedule.dayOfWeek === dayOfWeek);
        if (!daySchedule || !daySchedule.isOpen)
            return [];
        return daySchedule.timeSlots.filter(slot => !slot.isBreak);
    }
    async getStaffAvailability(businessId, staffIds, date) {
        const normalizedDate = this.normalizeDate(date);
        return await this.staffAvailabilityModel
            .find({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            staffId: { $in: staffIds },
            date: normalizedDate,
            status: { $ne: 'unavailable' }
        })
            .lean()
            .exec();
    }
    async getAvailableStaffList(dto) {
        const date = this.parseDate(dto.date);
        const normalizedDate = this.normalizeDate(date);
        const staffAvailability = await this.staffAvailabilityModel
            .find({
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            date: normalizedDate,
            status: { $ne: 'unavailable' }
        })
            .populate('staffId', 'firstName lastName skills')
            .exec();
        return staffAvailability.map((avail) => {
            const isSlotAvailable = this.isTimeSlotAvailable(avail.availableSlots, dto.startTime, dto.endTime);
            const isNotBlocked = !this.isTimeSlotBlocked(avail.blockedSlots || [], dto.startTime, dto.endTime);
            const staff = avail.staffId;
            let skillLevel = undefined;
            if (dto.serviceId && staff.skills) {
                const skill = staff.skills.find(s => s.serviceId.toString() === dto.serviceId);
                skillLevel = skill === null || skill === void 0 ? void 0 : skill.skillLevel;
            }
            return {
                staffId: staff._id.toString(),
                staffName: `${staff.firstName} ${staff.lastName}`,
                skillLevel,
                isAvailable: isSlotAvailable && isNotBlocked
            };
        }).filter(s => s.isAvailable);
    }
    getAvailableStaffForSlot(staffAvailability, startTime, endTime) {
        return staffAvailability
            .filter(availability => this.isTimeSlotAvailable(availability.availableSlots, startTime, endTime) &&
            !this.isTimeSlotBlocked(availability.blockedSlots, startTime, endTime))
            .map(availability => availability.staffId);
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
        const normalizedDate = this.normalizeDate(date);
        const availability = await this.staffAvailabilityModel
            .find({
            staffId: { $in: staffIds },
            date: normalizedDate,
            status: { $ne: 'unavailable' }
        })
            .lean()
            .exec();
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
    async createBusinessHours(businessId) {
        const existing = await this.businessHoursModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId)
        }).exec();
        if (existing) {
            throw new common_1.BadRequestException('Business hours already exist for this business');
        }
        await this.businessHoursModel.create({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            weeklySchedule: [
                { dayOfWeek: 0, isOpen: false, timeSlots: [] },
                { dayOfWeek: 1, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', isBreak: false }] },
                { dayOfWeek: 2, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', isBreak: false }] },
                { dayOfWeek: 3, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', isBreak: false }] },
                { dayOfWeek: 4, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', isBreak: false }] },
                { dayOfWeek: 5, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', isBreak: false }] },
                { dayOfWeek: 6, isOpen: true, timeSlots: [{ startTime: '09:00', endTime: '17:00', isBreak: false }] },
            ],
            holidays: [],
            specialOpenDays: [],
            defaultSlotDuration: 30,
            bufferTime: 0
        });
        return { success: true, message: 'Business hours created' };
    }
    async setupAvailabilityForBusiness(businessId, staffIds, startDate, endDate, createdBy) {
        await this.createBusinessHours(businessId);
        const start = this.parseDate(startDate);
        const end = this.parseDate(endDate);
        for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
            const date = new Date(currentDate);
            const dayOfWeek = date.getDay();
            if (dayOfWeek === 0)
                continue;
            for (const staffId of staffIds) {
                await this.createStaffAvailability({
                    businessId,
                    staffId,
                    date: date.toISOString().split('T')[0],
                    availableSlots: [
                        { startTime: '09:00', endTime: '17:00', isBreak: false }
                    ],
                    createdBy
                });
            }
        }
    }
    async createBusinessHours24x7(businessId) {
        const existing = await this.businessHoursModel.findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId)
        }).exec();
        if (existing) {
            throw new common_1.BadRequestException('Business hours already exist for this business');
        }
        const businessHoursData = {
            businessId: new mongoose_2.Types.ObjectId(businessId),
            operates24x7: true,
            weeklySchedule: [
                { dayOfWeek: 0, isOpen: true, is24Hours: true, timeSlots: [{ startTime: '00:00', endTime: '23:59', isBreak: false }] },
                { dayOfWeek: 1, isOpen: true, is24Hours: true, timeSlots: [{ startTime: '00:00', endTime: '23:59', isBreak: false }] },
                { dayOfWeek: 2, isOpen: true, is24Hours: true, timeSlots: [{ startTime: '00:00', endTime: '23:59', isBreak: false }] },
                { dayOfWeek: 3, isOpen: true, is24Hours: true, timeSlots: [{ startTime: '00:00', endTime: '23:59', isBreak: false }] },
                { dayOfWeek: 4, isOpen: true, is24Hours: true, timeSlots: [{ startTime: '00:00', endTime: '23:59', isBreak: false }] },
                { dayOfWeek: 5, isOpen: true, is24Hours: true, timeSlots: [{ startTime: '00:00', endTime: '23:59', isBreak: false }] },
                { dayOfWeek: 6, isOpen: true, is24Hours: true, timeSlots: [{ startTime: '00:00', endTime: '23:59', isBreak: false }] },
            ],
            holidays: [],
            specialOpenDays: [],
            defaultSlotDuration: 30,
            bufferTime: 0
        };
        await this.businessHoursModel.create(businessHoursData);
        return { success: true, message: 'Business hours created for 24/7 operation' };
    }
    async setupStaffAvailability24x7(businessId, staffId, startDate, endDate, createdBy) {
        console.log(`🌐 Setting up 24/7 availability for staff ${staffId}`);
        const start = this.parseDate(startDate.toISOString().split('T')[0]);
        const end = this.parseDate(endDate.toISOString().split('T')[0]);
        for (let currentDate = new Date(start); currentDate <= end; currentDate.setDate(currentDate.getDate() + 1)) {
            const date = new Date(currentDate);
            try {
                await this.createStaffAvailability({
                    businessId,
                    staffId,
                    date: date.toISOString().split('T')[0],
                    availableSlots: [
                        {
                            startTime: '00:00',
                            endTime: '23:59',
                            isBreak: false
                        }
                    ],
                    createdBy
                });
                console.log(`✅ Created 24/7 availability for ${date.toISOString().split('T')[0]}`);
            }
            catch (error) {
                console.warn(`⚠️ Failed to create availability for ${date.toISOString().split('T')[0]}:`, error.message);
            }
        }
    }
    async autoCreateStaffAvailability(businessId, staffId, createdBy) {
        const today = new Date();
        const endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
        await this.setupStaffAvailability24x7(businessId, staffId, today, endDate, createdBy);
    }
    async checkSlotAvailability(dto) {
        if (!dto.businessId) {
            throw new common_1.BadRequestException('Business ID is required');
        }
        const date = this.parseDate(dto.date);
        const bufferTime = dto.bufferTime || 0;
        const totalDuration = dto.duration + bufferTime;
        const endTime = this.addMinutesToTime(dto.startTime, totalDuration);
        console.log(`🔍 Checking availability:`, {
            date: date.toISOString().split('T')[0],
            startTime: dto.startTime,
            endTime: endTime,
            duration: dto.duration,
            bufferTime: bufferTime
        });
        const businessHours = await this.getBusinessHours(dto.businessId, date);
        const operates24x7 = businessHours.length > 0 &&
            businessHours.some(slot => slot.startTime === '00:00' && slot.endTime === '23:59');
        if (!operates24x7) {
            const isWithinBusinessHours = await this.isWithinBusinessHours(dto.businessId, date, dto.startTime, endTime);
            if (!isWithinBusinessHours) {
                console.log('❌ Outside business hours');
                return false;
            }
        }
        const normalizedDate = this.normalizeDate(date);
        const availableStaff = await this.staffAvailabilityModel
            .find({
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            date: normalizedDate,
            status: { $ne: 'unavailable' }
        })
            .exec();
        console.log(`👥 Found ${availableStaff.length} staff with availability records`);
        if (availableStaff.length === 0) {
            console.log('❌ No staff availability records found');
            return false;
        }
        const hasAvailableStaff = availableStaff.some(avail => {
            const isSlotAvailable = this.isTimeSlotAvailable(avail.availableSlots, dto.startTime, endTime);
            const isNotBlocked = !this.isTimeSlotBlocked(avail.blockedSlots, dto.startTime, endTime);
            const available = isSlotAvailable && isNotBlocked;
            if (available) {
                console.log(`✅ Staff ${avail.staffId} is available`);
            }
            return available;
        });
        console.log(`📊 Final result: ${hasAvailableStaff}`);
        return hasAvailableStaff;
    }
    async isFullyBooked(dto) {
        const date = this.parseDate(dto.date);
        const normalizedDate = this.normalizeDate(date);
        const bufferTime = dto.bufferTime || 0;
        const totalDuration = dto.duration + bufferTime;
        const endTime = this.addMinutesToTime(dto.startTime, totalDuration);
        const staffAvailabilityDocs = await this.staffAvailabilityModel
            .find({
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            date: normalizedDate
        })
            .lean()
            .exec();
        if (staffAvailabilityDocs.length === 0) {
            return {
                isFullyBooked: true,
                availableStaffCount: 0,
                totalStaffCount: 0,
                message: 'No staff availability configured for this date'
            };
        }
        const availableStaffAvailability = staffAvailabilityDocs.filter((avail) => {
            if (avail.status === 'unavailable')
                return false;
            const isSlotAvailable = this.isTimeSlotAvailable(avail.availableSlots || [], dto.startTime, endTime);
            const isNotBlocked = !this.isTimeSlotBlocked(avail.blockedSlots || [], dto.startTime, endTime);
            return isSlotAvailable && isNotBlocked;
        });
        const isFullyBooked = availableStaffAvailability.length === 0;
        return {
            isFullyBooked,
            availableStaffCount: availableStaffAvailability.length,
            totalStaffCount: staffAvailabilityDocs.length,
            message: isFullyBooked
                ? 'All staff are booked for this time slot'
                : `${availableStaffAvailability.length} staff member(s) available`,
            availableStaff: availableStaffAvailability.map((avail) => ({
                staffId: avail.staffId.toString(),
                staffName: 'Available Staff',
                currentWorkload: 0
            }))
        };
    }
    async isFullyBookedV2(dto) {
        const date = this.parseDate(dto.date);
        const normalizedDate = this.normalizeDate(date);
        const bufferTime = dto.bufferTime || 0;
        const totalDuration = dto.duration + bufferTime;
        const endTime = this.addMinutesToTime(dto.startTime, totalDuration);
        const query = this.staffAvailabilityModel.find({
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            date: normalizedDate
        });
        const leanQuery = query.lean();
        const staffAvailabilityDocs = await leanQuery.exec();
        if (staffAvailabilityDocs.length === 0) {
            return {
                isFullyBooked: true,
                availableStaffCount: 0,
                totalStaffCount: 0,
                message: 'No staff availability configured for this date'
            };
        }
        const availableStaffAvailability = staffAvailabilityDocs.filter((avail) => {
            if (avail.status === 'unavailable')
                return false;
            const isSlotAvailable = this.isTimeSlotAvailable(avail.availableSlots || [], dto.startTime, endTime);
            const isNotBlocked = !this.isTimeSlotBlocked(avail.blockedSlots || [], dto.startTime, endTime);
            return isSlotAvailable && isNotBlocked;
        });
        const isFullyBooked = availableStaffAvailability.length === 0;
        return {
            isFullyBooked,
            availableStaffCount: availableStaffAvailability.length,
            totalStaffCount: staffAvailabilityDocs.length,
            message: isFullyBooked
                ? 'All staff are booked for this time slot'
                : `${availableStaffAvailability.length} staff member(s) available`,
            availableStaff: availableStaffAvailability.map((avail) => ({
                staffId: avail.staffId.toString(),
                staffName: 'Available Staff',
                currentWorkload: 0
            }))
        };
    }
    async isFullyBookedV3(dto) {
        const date = this.parseDate(dto.date);
        const normalizedDate = this.normalizeDate(date);
        const bufferTime = dto.bufferTime || 0;
        const totalDuration = dto.duration + bufferTime;
        const endTime = this.addMinutesToTime(dto.startTime, totalDuration);
        const staffAvailabilityDocs = await this.staffAvailabilityModel.collection
            .find({
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            date: normalizedDate
        })
            .toArray();
        if (staffAvailabilityDocs.length === 0) {
            return {
                isFullyBooked: true,
                availableStaffCount: 0,
                totalStaffCount: 0,
                message: 'No staff availability configured for this date'
            };
        }
        const availableStaffAvailability = staffAvailabilityDocs.filter((avail) => {
            if (avail.status === 'unavailable')
                return false;
            const isSlotAvailable = this.isTimeSlotAvailable(avail.availableSlots || [], dto.startTime, endTime);
            const isNotBlocked = !this.isTimeSlotBlocked(avail.blockedSlots || [], dto.startTime, endTime);
            return isSlotAvailable && isNotBlocked;
        });
        const isFullyBooked = availableStaffAvailability.length === 0;
        return {
            isFullyBooked,
            availableStaffCount: availableStaffAvailability.length,
            totalStaffCount: staffAvailabilityDocs.length,
            message: isFullyBooked
                ? 'All staff are booked for this time slot'
                : `${availableStaffAvailability.length} staff member(s) available`,
            availableStaff: availableStaffAvailability.map((avail) => ({
                staffId: avail.staffId.toString(),
                staffName: 'Available Staff',
                currentWorkload: 0
            }))
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