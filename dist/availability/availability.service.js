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
const business_schema_1 = require("../business/schemas/business.schema");
const appointment_schema_1 = require("../appointment/schemas/appointment.schema");
const booking_service_1 = require("../booking/services/booking.service");
let AvailabilityService = class AvailabilityService {
    constructor(businessHoursModel, staffAvailabilityModel, businessModel, appointmentModel, bookingService) {
        this.businessHoursModel = businessHoursModel;
        this.staffAvailabilityModel = staffAvailabilityModel;
        this.businessModel = businessModel;
        this.appointmentModel = appointmentModel;
        this.bookingService = bookingService;
    }
    async getAvailableSlots(dto, authenticatedBusinessId) {
        let businessId;
        if (dto.subdomain) {
            const business = await this.businessModel.findOne({
                subdomain: dto.subdomain.toLowerCase()
            });
            if (!business) {
                throw new common_1.NotFoundException(`Business with subdomain '${dto.subdomain}' not found`);
            }
            businessId = business._id.toString();
        }
        else if (dto.businessId) {
            businessId = dto.businessId;
        }
        else if (authenticatedBusinessId) {
            businessId = authenticatedBusinessId;
        }
        else {
            throw new common_1.BadRequestException('Either subdomain or businessId must be provided, or user must be authenticated');
        }
        if (!dto.serviceIds || dto.serviceIds.length === 0) {
            throw new common_1.BadRequestException('At least one service must be selected');
        }
        const date = this.parseDate(dto.date);
        const businessHours = await this.getBusinessHours(businessId, date);
        if (!businessHours || businessHours.length === 0) {
            return [];
        }
        const services = await this.getServicesByIds(dto.serviceIds);
        if (services.length === 0) {
            throw new common_1.BadRequestException('No valid services found');
        }
        const calculatedDuration = this.calculateTotalDuration(services, dto.bookingType || 'sequential', dto.bufferTime || 0);
        const totalDuration = dto.durationOverride || calculatedDuration;
        let eligibleStaff = [];
        if (dto.staffId) {
            const normalizedDate = this.normalizeDate(date);
            const staffAvailability = await this.staffAvailabilityModel
                .findOne({
                businessId: new mongoose_2.Types.ObjectId(businessId),
                staffId: new mongoose_2.Types.ObjectId(dto.staffId),
                date: normalizedDate,
                status: { $ne: 'unavailable' }
            })
                .lean()
                .exec();
            if (staffAvailability) {
                eligibleStaff = [staffAvailability];
            }
        }
        const slots = this.generateSlotsFromBusinessHours(businessHours, eligibleStaff, totalDuration, dto.staffId ? true : false);
        const slotsWithBookingCheck = await this.checkSlotsAgainstBookings(businessId, date, slots);
        return slotsWithBookingCheck;
    }
    generateSlotsFromBusinessHours(businessHours, staff, duration, requireStaff) {
        const slots = [];
        for (const hours of businessHours) {
            const startMinutes = this.timeToMinutes(hours.startTime);
            const endMinutes = this.timeToMinutes(hours.endTime);
            for (let currentMinutes = startMinutes; currentMinutes + duration <= endMinutes; currentMinutes += 30) {
                const slotStart = this.minutesToTime(currentMinutes);
                const slotEnd = this.minutesToTime(currentMinutes + duration);
                let availableStaffIds = [];
                let isAvailable = true;
                if (requireStaff && staff.length > 0) {
                    const availableStaff = staff.filter(s => {
                        const isSlotAvailable = this.isTimeSlotAvailable(s.availableSlots || [], slotStart, slotEnd);
                        const isNotBlocked = !this.isTimeSlotBlocked(s.blockedSlots || [], slotStart, slotEnd);
                        return isSlotAvailable && isNotBlocked;
                    });
                    availableStaffIds = availableStaff.map(s => s.staffId);
                    isAvailable = availableStaffIds.length > 0;
                }
                else {
                    isAvailable = true;
                    availableStaffIds = [];
                }
                if (isAvailable) {
                    slots.push({
                        startTime: slotStart,
                        endTime: slotEnd,
                        duration: duration,
                        availableStaff: availableStaffIds,
                        availableResources: [],
                        isBookable: true
                    });
                }
            }
        }
        return slots;
    }
    async checkSlotsAgainstBookings(businessId, date, slots) {
        try {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);
            const result = await this.bookingService.getBookings({
                businessId,
                startDate: startOfDay,
                endDate: endOfDay,
                status: ['confirmed', 'paid']
            });
            const existingBookings = result.bookings || [];
            if (existingBookings.length === 0) {
                return slots;
            }
            console.log(`📋 Found ${existingBookings.length} existing bookings on ${date.toISOString().split('T')[0]}`);
            return slots.map(slot => {
                const slotStartMins = this.timeToMinutes(slot.startTime);
                const slotEndMins = slotStartMins + slot.duration;
                const hasConflict = existingBookings.some(booking => {
                    const bookingStartTime = booking.preferredStartTime;
                    const bookingDuration = booking.totalDuration || 60;
                    const [bookingHour, bookingMin] = bookingStartTime.split(':').map(Number);
                    const bookingStartMins = bookingHour * 60 + bookingMin;
                    const bookingEndMins = bookingStartMins + bookingDuration;
                    const overlaps = (slotStartMins < bookingEndMins) && (slotEndMins > bookingStartMins);
                    if (overlaps) {
                        console.log(`  ❌ Slot ${slot.startTime}-${slot.endTime} conflicts with booking ${booking.bookingNumber}`);
                    }
                    return overlaps;
                });
                return {
                    ...slot,
                    isBookable: !hasConflict
                };
            });
        }
        catch (error) {
            console.error(`❌ Error checking slots against bookings: ${error.message}`);
            return slots.map(slot => ({ ...slot, isBookable: false }));
        }
    }
    async createCustomBusinessHours(businessId, weeklySchedule) {
        const existing = await this.businessHoursModel.findOne({ businessId: new mongoose_2.Types.ObjectId(businessId) });
        if (existing) {
            existing.weeklySchedule = weeklySchedule.map(day => ({
                dayOfWeek: day.dayOfWeek,
                isOpen: day.isOpen,
                timeSlots: day.timeSlots.map(slot => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isBreak: false
                })),
                is24Hours: false
            }));
            existing.operates24x7 = false;
            return await existing.save();
        }
        return await this.businessHoursModel.create({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            weeklySchedule: weeklySchedule.map(day => ({
                dayOfWeek: day.dayOfWeek,
                isOpen: day.isOpen,
                timeSlots: day.timeSlots.map(slot => ({
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                    isBreak: false
                })),
                is24Hours: false
            })),
            operates24x7: false
        });
    }
    generateAvailableSlotsBusinessFirst(businessHours, staff, duration) {
        const slots = [];
        for (const hours of businessHours) {
            const startMinutes = this.timeToMinutes(hours.startTime);
            const endMinutes = this.timeToMinutes(hours.endTime);
            for (let currentMinutes = startMinutes; currentMinutes + duration <= endMinutes; currentMinutes += 30) {
                const slotStart = this.minutesToTime(currentMinutes);
                const slotEnd = this.minutesToTime(currentMinutes + duration);
                let availableStaffIds = [];
                if (staff.length > 0) {
                    const availableStaff = staff.filter(s => {
                        const isSlotAvailable = this.isTimeSlotAvailable(s.availableSlots || [], slotStart, slotEnd);
                        const isNotBlocked = !this.isTimeSlotBlocked(s.blockedSlots || [], slotStart, slotEnd);
                        return isSlotAvailable && isNotBlocked;
                    });
                    availableStaffIds = availableStaff.map(s => s.staffId);
                }
                else {
                    availableStaffIds = [];
                }
                if (availableStaffIds.length > 0 || staff.length === 0) {
                    slots.push({
                        startTime: slotStart,
                        endTime: slotEnd,
                        duration: duration,
                        availableStaff: availableStaffIds,
                        availableResources: [],
                        isBookable: true
                    });
                }
            }
        }
        return slots;
    }
    async getServicesByIds(serviceIds) {
        console.warn('⚠️ Using mock service data - implement getServicesByIds with real Service model');
        return serviceIds.map(id => ({
            _id: new mongoose_2.Types.ObjectId(id),
            name: 'Service',
            duration: 30,
            bufferTime: 0,
            requiresSpecificStaff: false,
            eligibleStaffIds: []
        }));
    }
    calculateTotalDuration(services, bookingType, additionalBuffer = 0) {
        if (bookingType === 'parallel') {
            const maxDuration = Math.max(...services.map(s => s.duration));
            const maxBuffer = Math.max(...services.map(s => s.bufferTime || 0));
            return maxDuration + maxBuffer + additionalBuffer;
        }
        else {
            const totalServiceDuration = services.reduce((sum, s) => sum + s.duration, 0);
            const totalServiceBuffer = services.reduce((sum, s) => sum + (s.bufferTime || 0), 0);
            return totalServiceDuration + totalServiceBuffer + additionalBuffer;
        }
    }
    async getEligibleStaffForServices(staffAvailability, services) {
        const servicesWithStaffReqs = services.filter(s => s.requiresSpecificStaff);
        if (servicesWithStaffReqs.length === 0) {
            return staffAvailability;
        }
        const eligibleStaff = staffAvailability.filter((avail) => {
            return servicesWithStaffReqs.every((service) => {
                if (!service.eligibleStaffIds || service.eligibleStaffIds.length === 0) {
                    return true;
                }
                return service.eligibleStaffIds.some((eligibleId) => eligibleId.toString() === avail.staffId.toString());
            });
        });
        return eligibleStaff;
    }
    async checkMultiServiceAvailability(dto) {
        const date = this.parseDate(dto.date);
        const services = await this.getServicesByIds(dto.serviceIds);
        const totalDuration = this.calculateTotalDuration(services, dto.bookingType || 'sequential', dto.bufferTime || 0);
        const endTime = this.addMinutesToTime(dto.startTime, totalDuration);
        const serviceTimeline = this.buildServiceTimeline(services, dto.startTime, dto.bookingType || 'sequential');
        const isAvailable = await this.checkSlotAvailabilityInternal({
            businessId: dto.businessId,
            date: dto.date,
            startTime: dto.startTime,
            duration: totalDuration,
            bufferTime: dto.bufferTime || 0
        });
        const normalizedDate = this.normalizeDate(date);
        const availableStaff = await this.staffAvailabilityModel
            .find({
            businessId: new mongoose_2.Types.ObjectId(dto.businessId),
            date: normalizedDate,
            status: { $ne: 'unavailable' }
        })
            .exec();
        const eligibleStaff = availableStaff.filter(avail => {
            const isSlotAvailable = this.isTimeSlotAvailable(avail.availableSlots, dto.startTime, endTime);
            const isNotBlocked = !this.isTimeSlotBlocked(avail.blockedSlots || [], dto.startTime, endTime);
            return isSlotAvailable && isNotBlocked;
        });
        return {
            isAvailable,
            totalDuration,
            endTime,
            availableStaffCount: eligibleStaff.length,
            services: serviceTimeline
        };
    }
    buildServiceTimeline(services, startTime, bookingType) {
        const timeline = [];
        if (bookingType === 'parallel') {
            services.forEach(service => {
                timeline.push({
                    serviceId: service._id.toString(),
                    serviceName: service.name,
                    startTime: startTime,
                    endTime: this.addMinutesToTime(startTime, service.duration)
                });
            });
        }
        else {
            let currentTime = startTime;
            services.forEach(service => {
                const serviceEndTime = this.addMinutesToTime(currentTime, service.duration + (service.bufferTime || 0));
                timeline.push({
                    serviceId: service._id.toString(),
                    serviceName: service.name,
                    startTime: currentTime,
                    endTime: serviceEndTime
                });
                currentTime = serviceEndTime;
            });
        }
        return timeline;
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
    async getAllSlots(dto, authenticatedBusinessId) {
        let businessId;
        if (dto.subdomain) {
            const business = await this.businessModel.findOne({
                subdomain: dto.subdomain.toLowerCase()
            });
            if (!business) {
                throw new common_1.NotFoundException(`Business with subdomain '${dto.subdomain}' not found`);
            }
            businessId = business._id.toString();
        }
        else if (dto.businessId) {
            businessId = dto.businessId;
        }
        else if (authenticatedBusinessId) {
            businessId = authenticatedBusinessId;
        }
        else {
            throw new common_1.BadRequestException('Either subdomain or businessId must be provided, or user must be authenticated');
        }
        const startDate = dto.startDate ? this.parseDate(dto.startDate) : new Date();
        const endDate = dto.endDate
            ? this.parseDate(dto.endDate)
            : new Date(startDate.getTime() + 90 * 24 * 60 * 60 * 1000);
        const rangeStart = this.normalizeDate(startDate);
        const rangeEnd = this.normalizeDate(endDate);
        rangeEnd.setHours(23, 59, 59, 999);
        const appointmentStatuses = [
            'pending_confirmation',
            'confirmed',
            'in_progress',
        ];
        const appointments = await this.appointmentModel
            .find({
            'businessInfo.businessId': businessId,
            selectedDate: { $gte: rangeStart, $lte: rangeEnd },
            status: { $in: appointmentStatuses },
        })
            .lean()
            .exec();
        const appointmentsByDate = {};
        for (const appointment of appointments) {
            const dateKey = new Date(appointment.selectedDate).toISOString().split('T')[0];
            const startTime = appointment.appointmentDetails?.startTime || appointment.selectedTime;
            const endTime = appointment.appointmentDetails?.endTime;
            if (!startTime || !endTime) {
                continue;
            }
            if (!appointmentsByDate[dateKey]) {
                appointmentsByDate[dateKey] = [];
            }
            appointmentsByDate[dateKey].push({
                startTime,
                endTime,
                assignedStaff: appointment.assignedStaff,
            });
        }
        const slotsData = {};
        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const date = new Date(currentDate);
            const dateString = date.toISOString().split('T')[0];
            const normalizedDate = this.normalizeDate(date);
            const businessHours = await this.getBusinessHours(businessId, date);
            if (businessHours.length === 0) {
                slotsData[dateString] = {
                    date: dateString,
                    hasSlots: false,
                    availableSlotCount: 0,
                    takenSlotCount: 0,
                    totalSlots: 0,
                    staffAvailable: 0
                };
                continue;
            }
            let totalSlots = 0;
            let availableSlotCount = 0;
            let takenSlotCount = 0;
            const slotsForDay = [];
            for (const businessHour of businessHours) {
                const startMinutes = this.timeToMinutes(businessHour.startTime);
                const endMinutes = this.timeToMinutes(businessHour.endTime);
                const defaultDuration = 30;
                for (let currentMinutes = startMinutes; currentMinutes + defaultDuration <= endMinutes; currentMinutes += defaultDuration) {
                    const slotStart = this.minutesToTime(currentMinutes);
                    slotsForDay.push({
                        startMinutes: currentMinutes,
                        endMinutes: currentMinutes + defaultDuration,
                        key: slotStart,
                    });
                }
            }
            totalSlots = slotsForDay.length;
            const appointmentsForDate = appointmentsByDate[dateString] || [];
            const relevantAppointments = dto.staffId
                ? appointmentsForDate.filter(appointment => appointment.assignedStaff?.toString() === dto.staffId)
                : appointmentsForDate;
            const takenSlots = new Set();
            for (const appointment of relevantAppointments) {
                const appointmentStart = this.timeToMinutes(appointment.startTime);
                const appointmentEnd = this.timeToMinutes(appointment.endTime);
                for (const slot of slotsForDay) {
                    const overlaps = slot.startMinutes < appointmentEnd && slot.endMinutes > appointmentStart;
                    if (overlaps) {
                        takenSlots.add(slot.key);
                    }
                }
            }
            takenSlotCount = takenSlots.size;
            availableSlotCount = Math.max(totalSlots - takenSlotCount, 0);
            let staffAvailableCount = 0;
            if (dto.staffId) {
                const staffAvailability = await this.staffAvailabilityModel
                    .findOne({
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    staffId: new mongoose_2.Types.ObjectId(dto.staffId),
                    date: normalizedDate,
                    status: { $ne: 'unavailable' }
                })
                    .lean()
                    .exec();
                staffAvailableCount = staffAvailability ? 1 : 0;
                if (!staffAvailability) {
                    availableSlotCount = 0;
                }
            }
            else {
                const staffCount = await this.staffAvailabilityModel
                    .countDocuments({
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    date: normalizedDate,
                    status: { $ne: 'unavailable' }
                });
                staffAvailableCount = staffCount;
            }
            slotsData[dateString] = {
                date: dateString,
                hasSlots: availableSlotCount > 0,
                availableSlotCount,
                takenSlotCount,
                totalSlots,
                staffAvailable: staffAvailableCount
            };
        }
        const result = Object.values(slotsData).sort((a, b) => a.date.localeCompare(b.date));
        return {
            dateRange: {
                start: startDate.toISOString().split('T')[0],
                end: endDate.toISOString().split('T')[0]
            },
            slots: result,
            summary: {
                totalDates: result.length,
                datesWithAvailability: result.filter(d => d.hasSlots).length,
                datesFullyBooked: result.filter(d => !d.hasSlots && d.totalSlots > 0).length
            }
        };
    }
    async checkSlotAvailabilityInternal(dto) {
        const date = this.parseDate(dto.date);
        const bufferTime = dto.bufferTime || 0;
        const totalDuration = dto.duration + bufferTime;
        const endTime = this.addMinutesToTime(dto.startTime, totalDuration);
        const businessHours = await this.getBusinessHours(dto.businessId, date);
        const operates24x7 = businessHours.length > 0 &&
            businessHours.some(slot => slot.startTime === '00:00' && slot.endTime === '23:59');
        if (!operates24x7) {
            const isWithinBusinessHours = await this.isWithinBusinessHours(dto.businessId, date, dto.startTime, endTime);
            if (!isWithinBusinessHours) {
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
        if (availableStaff.length === 0) {
            return false;
        }
        return availableStaff.some(avail => {
            const isSlotAvailable = this.isTimeSlotAvailable(avail.availableSlots, dto.startTime, endTime);
            const isNotBlocked = !this.isTimeSlotBlocked(avail.blockedSlots, dto.startTime, endTime);
            return isSlotAvailable && isNotBlocked;
        });
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
                skillLevel = skill?.skillLevel;
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
        console.log(`🔍 Checking availability (business-hours based):`, {
            date: date.toISOString().split('T')[0],
            startTime: dto.startTime,
            endTime: endTime,
            duration: dto.duration,
            bufferTime: bufferTime
        });
        const businessHours = await this.getBusinessHours(dto.businessId, date);
        if (!businessHours || businessHours.length === 0) {
            console.log('❌ No business hours configured for this date');
            return false;
        }
        const operates24x7 = businessHours.some(slot => slot.startTime === '00:00' && slot.endTime === '23:59');
        if (!operates24x7) {
            const isWithinHours = businessHours.some(hours => hours.startTime <= dto.startTime && hours.endTime >= endTime);
            if (!isWithinHours) {
                console.log('❌ Outside business hours');
                return false;
            }
        }
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        try {
            const result = await this.bookingService.getBookings({
                businessId: dto.businessId,
                startDate: startOfDay,
                endDate: endOfDay,
                status: ['confirmed', 'paid']
            });
            const existingBookings = result.bookings || [];
            if (existingBookings.length === 0) {
                console.log('✅ No conflicting bookings, slot is available');
                return true;
            }
            const slotStartMins = this.timeToMinutes(dto.startTime);
            const slotEndMins = slotStartMins + totalDuration;
            const hasConflict = existingBookings.some(booking => {
                const bookingStartTime = booking.preferredStartTime;
                const bookingDuration = booking.totalDuration || 60;
                const [bHour, bMin] = bookingStartTime.split(':').map(Number);
                const bookingStartMins = bHour * 60 + bMin;
                const bookingEndMins = bookingStartMins + bookingDuration;
                return (slotStartMins < bookingEndMins) && (slotEndMins > bookingStartMins);
            });
            console.log(`📊 Slot available: ${!hasConflict}`);
            return !hasConflict;
        }
        catch (error) {
            console.error('❌ Error checking bookings for slot availability:', error.message);
            return true;
        }
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
    async checkAvailabilityGap(businessId, checkUntilDate) {
        const latestAvailability = await this.staffAvailabilityModel
            .findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId)
        })
            .sort({ date: -1 })
            .exec();
        if (!latestAvailability) {
            return true;
        }
        return latestAvailability.date < checkUntilDate;
    }
    async deleteOldAvailability(beforeDate) {
        const result = await this.staffAvailabilityModel
            .deleteMany({
            date: { $lt: beforeDate }
        })
            .exec();
        return { deletedCount: result.deletedCount || 0 };
    }
    async ensureAllStaffAvailability(businessId, daysAhead = 90) {
        const allStaffIds = await this.staffAvailabilityModel
            .distinct('staffId', {
            businessId: new mongoose_2.Types.ObjectId(businessId)
        })
            .exec();
        console.log(`📋 Found ${allStaffIds.length} staff members for business ${businessId}`);
        for (const staffId of allStaffIds) {
            await this.ensureStaffAvailabilityExtended(businessId, staffId.toString(), daysAhead);
        }
    }
    async ensureStaffAvailabilityExtended(businessId, staffId, daysAhead = 90) {
        const today = new Date();
        const futureDate = new Date(today.getTime() + daysAhead * 24 * 60 * 60 * 1000);
        const lastAvailability = await this.staffAvailabilityModel
            .findOne({
            businessId: new mongoose_2.Types.ObjectId(businessId),
            staffId: new mongoose_2.Types.ObjectId(staffId)
        })
            .sort({ date: -1 })
            .exec();
        const startDate = lastAvailability
            ? new Date(lastAvailability.date.getTime() + 24 * 60 * 60 * 1000)
            : today;
        let createdCount = 0;
        for (let currentDate = new Date(startDate); currentDate <= futureDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const date = new Date(currentDate);
            const normalizedDate = this.normalizeDate(date);
            const exists = await this.staffAvailabilityModel.exists({
                businessId: new mongoose_2.Types.ObjectId(businessId),
                staffId: new mongoose_2.Types.ObjectId(staffId),
                date: normalizedDate
            });
            if (!exists) {
                await this.staffAvailabilityModel.create({
                    staffId: new mongoose_2.Types.ObjectId(staffId),
                    businessId: new mongoose_2.Types.ObjectId(businessId),
                    date: normalizedDate,
                    availableSlots: [
                        { startTime: '00:00', endTime: '23:59', isBreak: false }
                    ],
                    status: 'available',
                    createdBy: new mongoose_2.Types.ObjectId(staffId)
                });
                createdCount++;
            }
        }
        if (createdCount > 0) {
            console.log(`✅ Created ${createdCount} availability records for staff ${staffId}`);
        }
    }
};
AvailabilityService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(business_hours_schema_1.BusinessHours.name)),
    __param(1, (0, mongoose_1.InjectModel)(staff_availability_schema_1.StaffAvailability.name)),
    __param(2, (0, mongoose_1.InjectModel)(business_schema_1.Business.name)),
    __param(3, (0, mongoose_1.InjectModel)(appointment_schema_1.Appointment.name)),
    __param(4, (0, common_1.Inject)((0, common_1.forwardRef)(() => booking_service_1.BookingService))),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        booking_service_1.BookingService])
], AvailabilityService);
exports.AvailabilityService = AvailabilityService;
//# sourceMappingURL=availability.service.js.map