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
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = require("bcryptjs");
const staff_schema_1 = require("./schemas/staff.schema");
const staff_schedule_schema_1 = require("./schemas/staff-schedule.schema");
const staff_assignment_schema_1 = require("./schemas/staff-assignment.schema");
const working_hours_schema_1 = require("./schemas/working-hours.schema");
const user_schema_1 = require("../auth/schemas/user.schema");
let StaffService = class StaffService {
    constructor(staffModel, staffScheduleModel, staffAssignmentModel, workingHoursModel, userModel) {
        this.staffModel = staffModel;
        this.staffScheduleModel = staffScheduleModel;
        this.staffAssignmentModel = staffAssignmentModel;
        this.workingHoursModel = workingHoursModel;
        this.userModel = userModel;
    }
    async createStaff(createStaffDto) {
        let createdUserId = null;
        try {
            const existingUser = await this.userModel.findOne({ email: createStaffDto.email.toLowerCase() }).exec();
            if (existingUser)
                throw new common_1.ConflictException('A user with this email already exists');
            const existingStaff = await this.staffModel.findOne({
                businessId: new mongoose_2.Types.ObjectId(createStaffDto.businessId),
                phone: createStaffDto.phone
            }).exec();
            if (existingStaff)
                throw new common_1.ConflictException('A staff member with this phone number already exists in this business');
            const staffId = await this.generateStaffId(createStaffDto.businessId);
            const hashedPassword = createStaffDto.password
                ? await bcrypt.hash(createStaffDto.password, 12)
                : await bcrypt.hash(this.generateDefaultPassword(), 12);
            const newUser = new this.userModel({
                firstName: createStaffDto.firstName,
                lastName: createStaffDto.lastName,
                email: createStaffDto.email.toLowerCase(),
                phone: createStaffDto.phone,
                password: hashedPassword,
                role: user_schema_1.UserRole.STAFF,
                status: user_schema_1.UserStatus.ACTIVE,
                authProvider: 'local',
                emailVerified: false,
                phoneVerified: false,
                profileImage: createStaffDto.profileImage || '',
                staffBusinessId: new mongoose_2.Types.ObjectId(createStaffDto.businessId),
                preferences: {
                    language: 'en',
                    timezone: 'Africa/Lagos',
                    currency: 'NGN',
                    notifications: { email: true, sms: true, push: true }
                }
            });
            const savedUser = await newUser.save();
            createdUserId = savedUser._id.toString();
            const staff = new this.staffModel({
                userId: savedUser._id,
                businessId: new mongoose_2.Types.ObjectId(createStaffDto.businessId),
                staffId,
                firstName: createStaffDto.firstName,
                lastName: createStaffDto.lastName,
                email: createStaffDto.email.toLowerCase(),
                phone: createStaffDto.phone,
                role: createStaffDto.role,
                employmentType: createStaffDto.employmentType || 'full_time',
                hireDate: createStaffDto.hireDate,
                status: 'active',
                skills: createStaffDto.skills || [],
                commissionStructure: createStaffDto.commissionStructure || [],
                profileImage: createStaffDto.profileImage || '',
                bio: createStaffDto.bio || '',
                certifications: createStaffDto.certifications || [],
                totalRating: 0,
                totalReviews: 0,
                completedAppointments: 0,
            });
            const savedStaff = await staff.save();
            await this.createDefaultSchedule(savedStaff._id.toString(), createStaffDto.businessId);
            return JSON.parse(JSON.stringify(savedStaff));
        }
        catch (error) {
            if (createdUserId)
                await this.userModel.findByIdAndDelete(createdUserId).exec();
            throw error;
        }
    }
    generateDefaultPassword() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%';
        let password = '';
        for (let i = 0; i < 12; i++)
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        return password;
    }
    async getStaffById(staffId) {
        const staffDoc = await this.staffModel.findById(staffId).exec();
        if (!staffDoc)
            throw new common_1.NotFoundException('Staff member not found');
        const staff = JSON.parse(JSON.stringify(staffDoc));
        const userDoc = await this.userModel.findById(staff.userId).select('firstName lastName email phone role status').exec();
        const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null;
        return { ...staff, userId: user };
    }
    async updateStaffStatus(staffId, status, reason) {
        const validStatuses = ['active', 'inactive', 'on_leave', 'terminated'];
        if (!validStatuses.includes(status))
            throw new common_1.BadRequestException('Invalid status provided');
        const staff = await this.staffModel.findById(staffId).exec();
        if (!staff)
            throw new common_1.NotFoundException('Staff member not found');
        const updateData = { status, updatedAt: new Date() };
        if (status === 'terminated') {
            updateData.terminationDate = new Date();
            await this.userModel.findByIdAndUpdate(staff.userId, { status: user_schema_1.UserStatus.INACTIVE, staffBusinessId: null }).exec();
        }
        const resultDoc = await this.staffModel.findByIdAndUpdate(staffId, updateData, { new: true }).exec();
        if (!resultDoc)
            throw new common_1.NotFoundException('Failed to update staff');
        const result = JSON.parse(JSON.stringify(resultDoc));
        const userDoc = await this.userModel.findById(result.userId).select('firstName lastName email phone role status').exec();
        const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null;
        return { ...result, userId: user };
    }
    async updateStaffSkills(staffId, skills) {
        const resultDoc = await this.staffModel.findByIdAndUpdate(staffId, { skills, updatedAt: new Date() }, { new: true }).exec();
        if (!resultDoc)
            throw new common_1.NotFoundException('Staff member not found');
        const result = JSON.parse(JSON.stringify(resultDoc));
        const userDoc = await this.userModel.findById(result.userId).select('firstName lastName email phone').exec();
        const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null;
        return { ...result, userId: user };
    }
    async getStaffByBusiness(businessId, status) {
        const query = { businessId: new mongoose_2.Types.ObjectId(businessId) };
        if (status)
            query.status = status;
        const staffDocs = await this.staffModel.find(query).sort({ firstName: 1 }).exec();
        const staffList = JSON.parse(JSON.stringify(staffDocs));
        return await Promise.all(staffList.map(async (staff) => {
            const userDoc = await this.userModel.findById(staff.userId).select('firstName lastName email phone role status').exec();
            const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null;
            return { ...staff, userId: user };
        }));
    }
    async getAvailableStaff(businessId, date, startTime, endTime, serviceId) {
        let staffQuery = { businessId: new mongoose_2.Types.ObjectId(businessId), status: 'active' };
        if (serviceId) {
            staffQuery['skills.serviceId'] = new mongoose_2.Types.ObjectId(serviceId);
            staffQuery['skills.isActive'] = true;
        }
        const staffDocs = await this.staffModel.find(staffQuery).exec();
        const staff = JSON.parse(JSON.stringify(staffDocs));
        const availableStaff = [];
        for (const member of staff) {
            const isAvailable = await this.checkStaffAvailability(member._id.toString(), date, startTime, endTime);
            if (isAvailable) {
                const userDoc = await this.userModel.findById(member.userId).select('firstName lastName email phone').exec();
                const user = userDoc ? JSON.parse(JSON.stringify(userDoc)) : null;
                availableStaff.push({ ...member, userId: user });
            }
        }
        return availableStaff;
    }
    async createStaffSchedule(createScheduleDto) {
        await this.deactivateOverlappingSchedules(createScheduleDto.staffId, createScheduleDto.effectiveDate, createScheduleDto.endDate);
        const schedule = new this.staffScheduleModel({
            ...createScheduleDto,
            staffId: new mongoose_2.Types.ObjectId(createScheduleDto.staffId),
            businessId: new mongoose_2.Types.ObjectId(createScheduleDto.businessId),
            createdBy: new mongoose_2.Types.ObjectId(createScheduleDto.createdBy),
        });
        const saved = await schedule.save();
        return JSON.parse(JSON.stringify(saved));
    }
    async getStaffSchedule(staffId, date) {
        const schedule = await this.staffScheduleModel.findOne({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            effectiveDate: { $lte: date },
            $or: [{ endDate: null }, { endDate: { $gte: date } }],
            isActive: true
        }).exec();
        return schedule ? JSON.parse(JSON.stringify(schedule)) : null;
    }
    async updateStaffSchedule(scheduleId, updateData) {
        const schedule = await this.staffScheduleModel.findByIdAndUpdate(scheduleId, { ...updateData, updatedAt: new Date() }, { new: true }).exec();
        if (!schedule)
            throw new common_1.NotFoundException('Schedule not found');
        return JSON.parse(JSON.stringify(schedule));
    }
    async assignStaffToAppointment(assignmentDto) {
        try {
            const { businessId, appointmentId, staffId, assignmentDate, assignmentDetails } = assignmentDto;
            const { serviceId, startTime, endTime, estimatedDuration } = assignmentDetails;
            const calculatedEndTime = endTime || this.addMinutesToTime(startTime, estimatedDuration);
            const isAvailable = await this.checkStaffAvailability(staffId, assignmentDate, startTime, calculatedEndTime);
            if (!isAvailable)
                throw new common_1.BadRequestException('Staff is not available for the requested time slot');
            const staffDoc = await this.staffModel.findById(staffId).exec();
            if (!staffDoc)
                throw new common_1.NotFoundException('Staff member not found');
            const staff = JSON.parse(JSON.stringify(staffDoc));
            const fullAssignmentDetails = {
                startTime,
                endTime: calculatedEndTime,
                assignmentType: assignmentDetails.assignmentType || 'primary',
                estimatedDuration,
                serviceId: new mongoose_2.Types.ObjectId(serviceId),
                serviceName: assignmentDetails.serviceName || 'Service',
                specialInstructions: assignmentDetails.specialInstructions || '',
                roomNumber: assignmentDetails.roomNumber || '',
                requiredEquipment: assignmentDetails.requiredEquipment || [],
                clientPreferences: assignmentDetails.clientPreferences || '',
                setupTimeMinutes: assignmentDetails.setupTimeMinutes || 0,
                cleanupTimeMinutes: assignmentDetails.cleanupTimeMinutes || 0
            };
            const assignment = new this.staffAssignmentModel({
                staffId: new mongoose_2.Types.ObjectId(staffId),
                businessId: new mongoose_2.Types.ObjectId(businessId),
                appointmentId: new mongoose_2.Types.ObjectId(appointmentId),
                clientId: assignmentDto.clientId ? new mongoose_2.Types.ObjectId(assignmentDto.clientId) : undefined,
                assignmentDate,
                assignmentDetails: fullAssignmentDetails,
                assignedBy: assignmentDto.assignedBy ? new mongoose_2.Types.ObjectId(assignmentDto.assignedBy) : undefined,
                assignmentMethod: assignmentDto.assignmentMethod || 'manual',
                status: 'scheduled'
            });
            await assignment.save();
            return {
                staffId: staff._id.toString(),
                serviceId,
                staffName: `${staff.firstName} ${staff.lastName}`,
                email: staff.email,
                phone: staff.phone,
                status: 'assigned',
                assignedAt: new Date()
            };
        }
        catch (error) {
            console.error(`Failed to assign staff:`, error.message);
            throw error;
        }
    }
    async autoAssignStaff(businessId, appointmentId, clientId, serviceId, assignmentDate, startTime, endTime) {
        try {
            const availableStaff = await this.getAvailableStaff(businessId, assignmentDate, startTime, endTime, serviceId);
            if (availableStaff.length === 0)
                throw new common_1.BadRequestException('No staff available for the requested time slot');
            const selectedStaff = await this.selectBestStaff(availableStaff, serviceId, clientId);
            const duration = this.calculateMinutesDifference(startTime, endTime);
            const assignment = new this.staffAssignmentModel({
                staffId: selectedStaff._id,
                businessId: new mongoose_2.Types.ObjectId(businessId),
                appointmentId: new mongoose_2.Types.ObjectId(appointmentId),
                clientId: new mongoose_2.Types.ObjectId(clientId),
                assignmentDate,
                assignmentDetails: {
                    startTime, endTime, assignmentType: 'primary', estimatedDuration: duration,
                    serviceId: new mongoose_2.Types.ObjectId(serviceId), serviceName: 'Service',
                    specialInstructions: '', roomNumber: '', requiredEquipment: [],
                    clientPreferences: '', setupTimeMinutes: 0, cleanupTimeMinutes: 0
                },
                assignedBy: selectedStaff._id,
                assignmentMethod: 'auto',
                status: 'scheduled'
            });
            await assignment.save();
            return {
                staffId: selectedStaff._id.toString(), serviceId,
                staffName: `${selectedStaff.firstName} ${selectedStaff.lastName}`,
                email: selectedStaff.email, phone: selectedStaff.phone,
                status: 'assigned', assignedAt: new Date()
            };
        }
        catch (error) {
            console.error('Auto-assignment failed:', error.message);
            throw error;
        }
    }
    async getStaffAssignments(staffId, startDate, endDate) {
        const assignmentDocs = await this.staffAssignmentModel.find({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            assignmentDate: { $gte: startDate, $lte: endDate }
        }).sort({ assignmentDate: 1, 'assignmentDetails.startTime': 1 }).exec();
        return JSON.parse(JSON.stringify(assignmentDocs));
    }
    async completeStaffAssignment(assignmentId, completionData) {
        const assignment = await this.staffAssignmentModel.findByIdAndUpdate(assignmentId, {
            ...completionData, status: 'completed', updatedAt: new Date()
        }, { new: true }).exec();
        if (!assignment)
            throw new common_1.NotFoundException('Assignment not found');
        await this.updateStaffStats(assignment.staffId.toString());
        return JSON.parse(JSON.stringify(assignment));
    }
    async checkInStaff(checkInDto) {
        const { staffId, businessId, checkedInBy } = checkInDto;
        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const schedule = await this.getStaffSchedule(staffId, today);
        const daySchedule = schedule?.weeklySchedule.find((day) => day.dayOfWeek === today.getDay());
        if (!daySchedule || !daySchedule.isWorkingDay)
            throw new common_1.BadRequestException('Staff is not scheduled to work today');
        const currentTime = today.toTimeString().substr(0, 5);
        await this.recordWorkingHours({
            staffId, businessId, date: todayDate,
            scheduledHours: daySchedule.workingHours,
            actualHours: [{ startTime: currentTime, endTime: '', isBreak: false, breakType: '' }],
            attendanceStatus: 'present', checkedInBy
        });
    }
    async checkOutStaff(staffId, businessId, checkedOutBy) {
        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const currentTime = today.toTimeString().substr(0, 5);
        const workingHours = await this.workingHoursModel.findOne({ staffId: new mongoose_2.Types.ObjectId(staffId), date: todayDate }).exec();
        if (!workingHours)
            throw new common_1.BadRequestException('Staff has not checked in today');
        if (workingHours.actualHours.length > 0) {
            const lastSlot = workingHours.actualHours[workingHours.actualHours.length - 1];
            if (!lastSlot.endTime)
                lastSlot.endTime = currentTime;
        }
        workingHours.actualMinutes = this.calculateTotalMinutes(workingHours.actualHours);
        workingHours.overtimeMinutes = Math.max(0, workingHours.actualMinutes - workingHours.scheduledMinutes);
        workingHours.checkedOutBy = new mongoose_2.Types.ObjectId(checkedOutBy);
        workingHours.updatedAt = new Date();
        await workingHours.save();
    }
    async getStaffWorkingHours(staffId, startDate, endDate) {
        const docs = await this.workingHoursModel.find({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            date: { $gte: startDate, $lte: endDate }
        }).sort({ date: 1 }).exec();
        return JSON.parse(JSON.stringify(docs));
    }
    async recordWorkingHours(workingHoursDto) {
        const toWorkingTimeSlot = (slot) => ({
            startTime: slot.startTime, endTime: slot.endTime,
            isBreak: slot.isBreak ?? false, breakType: slot.breakType ?? ''
        });
        const existingRecord = await this.workingHoursModel.findOne({
            staffId: new mongoose_2.Types.ObjectId(workingHoursDto.staffId),
            date: new Date(workingHoursDto.date.getFullYear(), workingHoursDto.date.getMonth(), workingHoursDto.date.getDate())
        }).exec();
        const scheduledMinutes = this.calculateTotalMinutes(workingHoursDto.scheduledHours);
        const actualMinutes = workingHoursDto.actualHours ? this.calculateTotalMinutes(workingHoursDto.actualHours) : 0;
        if (existingRecord) {
            existingRecord.actualHours = (workingHoursDto.actualHours || []).map(toWorkingTimeSlot);
            existingRecord.actualMinutes = actualMinutes;
            existingRecord.breakMinutes = workingHoursDto.breakMinutes || 0;
            existingRecord.attendanceStatus = workingHoursDto.attendanceStatus || 'present';
            existingRecord.notes = workingHoursDto.notes;
            existingRecord.updatedAt = new Date();
            const saved = await existingRecord.save();
            return JSON.parse(JSON.stringify(saved));
        }
        const workingHours = new this.workingHoursModel({
            ...workingHoursDto,
            staffId: new mongoose_2.Types.ObjectId(workingHoursDto.staffId),
            businessId: new mongoose_2.Types.ObjectId(workingHoursDto.businessId),
            scheduledMinutes, actualMinutes,
            checkedInBy: new mongoose_2.Types.ObjectId(workingHoursDto.checkedInBy),
            actualHours: (workingHoursDto.actualHours || []).map(toWorkingTimeSlot)
        });
        const saved = await workingHours.save();
        return JSON.parse(JSON.stringify(saved));
    }
    async checkStaffAvailability(staffId, date, startTime, endTime) {
        const schedule = await this.getStaffSchedule(staffId, date);
        if (!schedule)
            return false;
        const dayOfWeek = date.getDay();
        const daySchedule = schedule.weeklySchedule.find((day) => day.dayOfWeek === dayOfWeek);
        if (!daySchedule || !daySchedule.isWorkingDay)
            return false;
        const isWithinWorkingHours = daySchedule.workingHours.some((slot) => slot.startTime <= startTime && slot.endTime >= endTime);
        if (!isWithinWorkingHours)
            return false;
        const existingAssignments = await this.staffAssignmentModel.find({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            assignmentDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
        }).exec();
        for (const assignment of existingAssignments) {
            if (this.timeOverlaps(startTime, endTime, assignment.assignmentDetails.startTime, assignment.assignmentDetails.endTime)) {
                return false;
            }
        }
        return true;
    }
    async selectBestStaff(availableStaff, serviceId, clientId) {
        const staffScores = await Promise.all(availableStaff.map(async (staff) => {
            let score = 0;
            const skill = staff.skills.find((s) => s.serviceId.toString() === serviceId);
            if (skill) {
                const skillScores = { 'master': 40, 'expert': 30, 'intermediate': 20, 'beginner': 10 };
                score += skillScores[skill.skillLevel] || 0;
            }
            if (staff.totalReviews > 0)
                score += (staff.totalRating / staff.totalReviews) * 6;
            const experienceMonths = skill?.experienceMonths || 0;
            score += Math.min(experienceMonths / 6, 20);
            const todayAssignments = await this.staffAssignmentModel.countDocuments({
                staffId: staff._id, assignmentDate: new Date(),
                status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
            }).exec();
            score += Math.max(10 - todayAssignments, 0);
            return { staff, score };
        }));
        staffScores.sort((a, b) => b.score - a.score);
        return staffScores[0].staff;
    }
    async updateStaffStats(staffId) {
        const completedAssignments = await this.staffAssignmentModel.countDocuments({
            staffId: new mongoose_2.Types.ObjectId(staffId), status: 'completed'
        }).exec();
        await this.staffModel.findByIdAndUpdate(staffId, { completedAppointments: completedAssignments }).exec();
    }
    timeOverlaps(start1, end1, start2, end2) {
        return !(end1 <= start2 || start1 >= end2);
    }
    calculateMinutesDifference(startTime, endTime) {
        return this.timeToMinutes(endTime) - this.timeToMinutes(startTime);
    }
    timeToMinutes(time) {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    }
    calculateTotalMinutes(timeSlots) {
        return timeSlots.reduce((total, slot) => {
            if (!slot.endTime || slot.isBreak)
                return total;
            return total + this.calculateMinutesDifference(slot.startTime, slot.endTime);
        }, 0);
    }
    addMinutesToTime(time, minutes) {
        const [hours, mins] = time.split(':').map(Number);
        const totalMinutes = hours * 60 + mins + minutes;
        const newHours = Math.floor(totalMinutes / 60);
        const newMins = totalMinutes % 60;
        return `${newHours.toString().padStart(2, '0')}:${newMins.toString().padStart(2, '0')}`;
    }
    async generateStaffId(businessId) {
        const count = await this.staffModel.countDocuments({ businessId: new mongoose_2.Types.ObjectId(businessId) }).exec();
        return `STF${String(count + 1).padStart(4, '0')}`;
    }
    async createDefaultSchedule(staffId, businessId) {
        const default24_7Schedule = [];
        for (let day = 0; day <= 6; day++) {
            default24_7Schedule.push({
                dayOfWeek: day, isWorkingDay: true,
                workingHours: [{ startTime: '00:00', endTime: '23:59', isBreak: false }],
                breaks: [], maxHoursPerDay: 24
            });
        }
        await this.createStaffSchedule({
            staffId, businessId, effectiveDate: new Date(), endDate: undefined,
            weeklySchedule: default24_7Schedule, scheduleType: '24_7',
            reason: 'Default 24/7 staff availability', createdBy: staffId, isDefault24_7: true
        });
    }
    async deactivateOverlappingSchedules(staffId, effectiveDate, endDate) {
        const query = {
            staffId: new mongoose_2.Types.ObjectId(staffId), isActive: true,
            effectiveDate: { $lte: endDate || new Date('2099-12-31') }
        };
        if (endDate)
            query.$or = [{ endDate: null }, { endDate: { $gte: effectiveDate } }];
        await this.staffScheduleModel.updateMany(query, { isActive: false, updatedAt: new Date() }).exec();
    }
    async getAssignmentsByAppointment(appointmentId) {
        try {
            const assignmentDocs = await this.staffAssignmentModel.find({ appointmentId: new mongoose_2.Types.ObjectId(appointmentId) }).exec();
            const assignments = JSON.parse(JSON.stringify(assignmentDocs));
            return await Promise.all(assignments.map(async (assignment) => {
                const staffDoc = await this.staffModel.findById(assignment.staffId).select('firstName lastName email phone').exec();
                const staff = staffDoc ? JSON.parse(JSON.stringify(staffDoc)) : null;
                return {
                    assignmentId: assignment._id.toString(),
                    staffId: assignment.staffId.toString(),
                    staffName: staff ? `${staff.firstName} ${staff.lastName}` : 'Unknown',
                    email: staff?.email,
                    phone: staff?.phone,
                    serviceId: assignment.assignmentDetails.serviceId.toString(),
                    serviceName: assignment.assignmentDetails.serviceName,
                    startTime: assignment.assignmentDetails.startTime,
                    endTime: assignment.assignmentDetails.endTime,
                    status: assignment.status,
                    assignedAt: assignment.createdAt
                };
            }));
        }
        catch (error) {
            console.error('Failed to get assignments:', error.message);
            return [];
        }
    }
    async updateAssignmentStatus(assignmentId, status) {
        try {
            await this.staffAssignmentModel.findByIdAndUpdate(assignmentId, { status, updatedAt: new Date() }, { new: true }).exec();
        }
        catch (error) {
            console.error('Failed to update assignment status:', error.message);
            throw error;
        }
    }
    async cancelStaffAssignment(assignmentId, reason) {
        try {
            await this.staffAssignmentModel.findByIdAndUpdate(assignmentId, {
                status: 'cancelled', cancellationReason: reason, updatedAt: new Date()
            }, { new: true }).exec();
        }
        catch (error) {
            console.error('Failed to cancel assignment:', error.message);
            throw error;
        }
    }
    async reassignStaff(assignmentId, newStaffId, reason) {
        try {
            const oldAssignment = await this.staffAssignmentModel.findById(assignmentId).exec();
            if (!oldAssignment)
                throw new common_1.NotFoundException('Assignment not found');
            const isAvailable = await this.checkStaffAvailability(newStaffId, oldAssignment.assignmentDate, oldAssignment.assignmentDetails.startTime, oldAssignment.assignmentDetails.endTime);
            if (!isAvailable)
                throw new common_1.BadRequestException('New staff is not available for this time slot');
            const newStaffDoc = await this.staffModel.findById(newStaffId).exec();
            if (!newStaffDoc)
                throw new common_1.NotFoundException('New staff member not found');
            const newStaff = JSON.parse(JSON.stringify(newStaffDoc));
            oldAssignment.status = 'cancelled';
            oldAssignment.cancellationReason = reason || 'Reassigned to different staff';
            await oldAssignment.save();
            const newAssignment = new this.staffAssignmentModel({
                staffId: new mongoose_2.Types.ObjectId(newStaffId),
                businessId: oldAssignment.businessId,
                appointmentId: oldAssignment.appointmentId,
                clientId: oldAssignment.clientId,
                assignmentDate: oldAssignment.assignmentDate,
                assignmentDetails: oldAssignment.assignmentDetails,
                assignmentMethod: 'manual',
                notes: `Reassigned from staff ${oldAssignment.staffId}. Reason: ${reason}`
            });
            await newAssignment.save();
            return {
                staffId: newStaff._id.toString(),
                serviceId: oldAssignment.assignmentDetails.serviceId.toString(),
                staffName: `${newStaff.firstName} ${newStaff.lastName}`,
                status: 'assigned',
                assignedAt: new Date()
            };
        }
        catch (error) {
            console.error('Failed to reassign staff:', error.message);
            throw error;
        }
    }
    async getStaffWorkload(staffId, date) {
        const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const assignmentDocs = await this.staffAssignmentModel.find({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            assignmentDate: normalizedDate,
            status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
        }).sort({ 'assignmentDetails.startTime': 1 }).exec();
        const assignments = JSON.parse(JSON.stringify(assignmentDocs));
        const totalMinutes = assignments.reduce((total, assignment) => {
            return total + assignment.assignmentDetails.estimatedDuration;
        }, 0);
        return { totalAssignments: assignments.length, totalMinutes, assignments };
    }
};
StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(staff_schema_1.Staff.name)),
    __param(1, (0, mongoose_1.InjectModel)(staff_schedule_schema_1.StaffSchedule.name)),
    __param(2, (0, mongoose_1.InjectModel)(staff_assignment_schema_1.StaffAssignment.name)),
    __param(3, (0, mongoose_1.InjectModel)(working_hours_schema_1.WorkingHours.name)),
    __param(4, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], StaffService);
exports.StaffService = StaffService;
//# sourceMappingURL=staff.service.js.map