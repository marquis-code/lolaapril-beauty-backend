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
const staff_schema_1 = require("../staff/schemas/staff.schema");
const staff_schedule_schema_1 = require("../staff/schemas/staff-schedule.schema");
const staff_assignment_schema_1 = require("../staff/schemas/staff-assignment.schema");
const working_hours_schema_1 = require("../staff/schemas/working-hours.schema");
let StaffService = class StaffService {
    constructor(staffModel, staffScheduleModel, staffAssignmentModel, workingHoursModel) {
        this.staffModel = staffModel;
        this.staffScheduleModel = staffScheduleModel;
        this.staffAssignmentModel = staffAssignmentModel;
        this.workingHoursModel = workingHoursModel;
    }
    async createStaff(createStaffDto) {
        const staffId = await this.generateStaffId(createStaffDto.businessId);
        const staff = new this.staffModel(Object.assign(Object.assign({}, createStaffDto), { staffId, userId: new mongoose_2.Types.ObjectId(createStaffDto.userId), businessId: new mongoose_2.Types.ObjectId(createStaffDto.businessId) }));
        const savedStaff = await staff.save();
        await this.createDefaultSchedule(savedStaff._id.toString(), createStaffDto.businessId);
        return savedStaff;
    }
    async getStaffById(staffId) {
        const staff = await this.staffModel
            .findById(staffId)
            .populate('userId', 'firstName lastName email')
            .exec();
        if (!staff) {
            throw new common_1.NotFoundException('Staff member not found');
        }
        return staff;
    }
    async updateStaffStatus(staffId, status, reason) {
        const validStatuses = ['active', 'inactive', 'on_leave', 'terminated'];
        if (!validStatuses.includes(status)) {
            throw new common_1.BadRequestException('Invalid status provided');
        }
        const updateData = {
            status,
            updatedAt: new Date()
        };
        if (status === 'terminated') {
            updateData.terminationDate = new Date();
        }
        const result = await this.staffModel.findByIdAndUpdate(staffId, updateData, { new: true }).exec();
        if (!result) {
            throw new common_1.NotFoundException('Staff member not found');
        }
        return result;
    }
    async updateStaffSkills(staffId, skills) {
        const result = await this.staffModel.findByIdAndUpdate(staffId, { skills, updatedAt: new Date() }, { new: true }).exec();
        if (!result) {
            throw new common_1.NotFoundException('Staff member not found');
        }
        return result;
    }
    async getStaffByBusiness(businessId, status) {
        const query = { businessId: new mongoose_2.Types.ObjectId(businessId) };
        if (status) {
            query.status = status;
        }
        const staff = await this.staffModel
            .find(query)
            .populate('userId', 'firstName lastName email')
            .sort({ firstName: 1 })
            .exec();
        return staff;
    }
    async getAvailableStaff(businessId, date, startTime, endTime, serviceId) {
        let staffQuery = {
            businessId: new mongoose_2.Types.ObjectId(businessId),
            status: 'active'
        };
        if (serviceId) {
            staffQuery['skills.serviceId'] = new mongoose_2.Types.ObjectId(serviceId);
            staffQuery['skills.isActive'] = true;
        }
        const staff = await this.staffModel.find(staffQuery);
        const availableStaff = [];
        for (const member of staff) {
            const isAvailable = await this.checkStaffAvailability(member._id.toString(), date, startTime, endTime);
            if (isAvailable) {
                availableStaff.push(member);
            }
        }
        return availableStaff;
    }
    async createStaffSchedule(createScheduleDto) {
        await this.deactivateOverlappingSchedules(createScheduleDto.staffId, createScheduleDto.effectiveDate, createScheduleDto.endDate);
        const schedule = new this.staffScheduleModel(Object.assign(Object.assign({}, createScheduleDto), { staffId: new mongoose_2.Types.ObjectId(createScheduleDto.staffId), businessId: new mongoose_2.Types.ObjectId(createScheduleDto.businessId), createdBy: new mongoose_2.Types.ObjectId(createScheduleDto.createdBy) }));
        return await schedule.save();
    }
    async getStaffSchedule(staffId, date) {
        const schedule = await this.staffScheduleModel.findOne({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            effectiveDate: { $lte: date },
            $or: [
                { endDate: null },
                { endDate: { $gte: date } }
            ],
            isActive: true
        }).exec();
        return schedule;
    }
    async updateStaffSchedule(scheduleId, updateData) {
        const schedule = await this.staffScheduleModel.findByIdAndUpdate(scheduleId, Object.assign(Object.assign({}, updateData), { updatedAt: new Date() }), { new: true }).exec();
        if (!schedule) {
            throw new common_1.NotFoundException('Schedule not found');
        }
        return schedule;
    }
    async assignStaffToAppointment(assignmentDto) {
        const isAvailable = await this.checkStaffAvailability(assignmentDto.staffId, assignmentDto.assignmentDate, assignmentDto.assignmentDetails.startTime, assignmentDto.assignmentDetails.endTime);
        if (!isAvailable) {
            throw new common_1.BadRequestException('Staff is not available for the requested time slot');
        }
        const hasSkill = await this.checkStaffSkill(assignmentDto.staffId, assignmentDto.assignmentDetails.serviceId);
        if (!hasSkill) {
            throw new common_1.BadRequestException('Staff does not have the required skills for this service');
        }
        const assignmentDetails = {
            startTime: assignmentDto.assignmentDetails.startTime,
            endTime: assignmentDto.assignmentDetails.endTime,
            assignmentType: assignmentDto.assignmentDetails.assignmentType,
            estimatedDuration: assignmentDto.assignmentDetails.estimatedDuration,
            specialInstructions: assignmentDto.assignmentDetails.specialInstructions,
            serviceId: new mongoose_2.Types.ObjectId(assignmentDto.assignmentDetails.serviceId),
            serviceName: assignmentDto.assignmentDetails.serviceName,
            roomNumber: assignmentDto.assignmentDetails.roomNumber,
            requiredEquipment: assignmentDto.assignmentDetails.requiredEquipment || [],
            clientPreferences: assignmentDto.assignmentDetails.clientPreferences,
            setupTimeMinutes: assignmentDto.assignmentDetails.setupTimeMinutes || 0,
            cleanupTimeMinutes: assignmentDto.assignmentDetails.cleanupTimeMinutes || 0
        };
        const assignment = new this.staffAssignmentModel({
            staffId: new mongoose_2.Types.ObjectId(assignmentDto.staffId),
            businessId: new mongoose_2.Types.ObjectId(assignmentDto.businessId),
            appointmentId: new mongoose_2.Types.ObjectId(assignmentDto.appointmentId),
            clientId: new mongoose_2.Types.ObjectId(assignmentDto.clientId),
            assignmentDate: assignmentDto.assignmentDate,
            assignmentDetails,
            assignedBy: new mongoose_2.Types.ObjectId(assignmentDto.assignedBy),
            assignmentMethod: assignmentDto.assignmentMethod || 'manual'
        });
        return await assignment.save();
    }
    async autoAssignStaff(businessId, appointmentId, clientId, serviceId, assignmentDate, startTime, endTime) {
        const availableStaff = await this.getAvailableStaff(businessId, assignmentDate, startTime, endTime, serviceId);
        if (availableStaff.length === 0) {
            throw new common_1.BadRequestException('No staff available for the requested time slot');
        }
        const selectedStaff = await this.selectBestStaff(availableStaff, serviceId, clientId);
        const assignmentDetails = {
            startTime,
            endTime,
            assignmentType: 'primary',
            estimatedDuration: this.calculateMinutesDifference(startTime, endTime),
            serviceId: new mongoose_2.Types.ObjectId(serviceId),
            serviceName: 'Service Name',
            specialInstructions: '',
            roomNumber: '',
            requiredEquipment: [],
            clientPreferences: '',
            setupTimeMinutes: 0,
            cleanupTimeMinutes: 0
        };
        const assignment = new this.staffAssignmentModel({
            staffId: selectedStaff._id,
            businessId: new mongoose_2.Types.ObjectId(businessId),
            appointmentId: new mongoose_2.Types.ObjectId(appointmentId),
            clientId: new mongoose_2.Types.ObjectId(clientId),
            assignmentDate,
            assignmentDetails,
            assignedBy: selectedStaff._id,
            assignmentMethod: 'auto'
        });
        return await assignment.save();
    }
    async getStaffAssignments(staffId, startDate, endDate) {
        const result = await this.staffAssignmentModel
            .find({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            assignmentDate: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .populate('appointmentId')
            .populate('clientId', 'firstName lastName email phone')
            .sort({ assignmentDate: 1, 'assignmentDetails.startTime': 1 })
            .exec();
        return result;
    }
    async completeStaffAssignment(assignmentId, completionData) {
        const assignment = await this.staffAssignmentModel.findByIdAndUpdate(assignmentId, Object.assign(Object.assign({}, completionData), { status: 'completed', updatedAt: new Date() }), { new: true }).exec();
        if (!assignment) {
            throw new common_1.NotFoundException('Assignment not found');
        }
        await this.updateStaffStats(assignment.staffId.toString());
        return assignment;
    }
    async checkInStaff(checkInDto) {
        const { staffId, businessId, checkedInBy } = checkInDto;
        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const schedule = await this.getStaffSchedule(staffId, today);
        const daySchedule = schedule === null || schedule === void 0 ? void 0 : schedule.weeklySchedule.find(day => day.dayOfWeek === today.getDay());
        if (!daySchedule || !daySchedule.isWorkingDay) {
            throw new common_1.BadRequestException('Staff is not scheduled to work today');
        }
        const currentTime = today.toTimeString().substr(0, 5);
        await this.recordWorkingHours({
            staffId,
            businessId,
            date: todayDate,
            scheduledHours: daySchedule.workingHours,
            actualHours: [{
                    startTime: currentTime,
                    endTime: '',
                    isBreak: false
                }],
            attendanceStatus: 'present',
            checkedInBy
        });
    }
    async checkOutStaff(staffId, businessId, checkedOutBy) {
        const today = new Date();
        const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        const currentTime = today.toTimeString().substr(0, 5);
        const workingHours = await this.workingHoursModel.findOne({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            date: todayDate
        });
        if (!workingHours) {
            throw new common_1.BadRequestException('Staff has not checked in today');
        }
        if (workingHours.actualHours.length > 0) {
            const lastSlot = workingHours.actualHours[workingHours.actualHours.length - 1];
            if (!lastSlot.endTime) {
                lastSlot.endTime = currentTime;
            }
        }
        workingHours.actualMinutes = this.calculateTotalMinutes(workingHours.actualHours);
        workingHours.overtimeMinutes = Math.max(0, workingHours.actualMinutes - workingHours.scheduledMinutes);
        workingHours.checkedOutBy = new mongoose_2.Types.ObjectId(checkedOutBy);
        workingHours.updatedAt = new Date();
        await workingHours.save();
    }
    async getStaffWorkingHours(staffId, startDate, endDate) {
        return await this.workingHoursModel
            .find({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            date: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .sort({ date: 1 })
            .exec();
    }
    async recordWorkingHours(workingHoursDto) {
        const toWorkingTimeSlot = (slot) => {
            var _a, _b;
            return ({
                startTime: slot.startTime,
                endTime: slot.endTime,
                isBreak: (_a = slot.isBreak) !== null && _a !== void 0 ? _a : false,
                breakType: (_b = slot.breakType) !== null && _b !== void 0 ? _b : '',
            });
        };
        const existingRecord = await this.workingHoursModel.findOne({
            staffId: new mongoose_2.Types.ObjectId(workingHoursDto.staffId),
            date: new Date(workingHoursDto.date.getFullYear(), workingHoursDto.date.getMonth(), workingHoursDto.date.getDate()),
        });
        const scheduledMinutes = this.calculateTotalMinutes(workingHoursDto.scheduledHours);
        const actualMinutes = workingHoursDto.actualHours
            ? this.calculateTotalMinutes(workingHoursDto.actualHours)
            : 0;
        if (existingRecord) {
            existingRecord.actualHours = (workingHoursDto.actualHours || []).map(toWorkingTimeSlot);
            existingRecord.actualMinutes = actualMinutes;
            existingRecord.breakMinutes = workingHoursDto.breakMinutes || 0;
            existingRecord.attendanceStatus = workingHoursDto.attendanceStatus || 'present';
            existingRecord.notes = workingHoursDto.notes;
            existingRecord.updatedAt = new Date();
            return await existingRecord.save();
        }
        const workingHours = new this.workingHoursModel(Object.assign(Object.assign({}, workingHoursDto), { staffId: new mongoose_2.Types.ObjectId(workingHoursDto.staffId), businessId: new mongoose_2.Types.ObjectId(workingHoursDto.businessId), scheduledMinutes,
            actualMinutes, checkedInBy: new mongoose_2.Types.ObjectId(workingHoursDto.checkedInBy), actualHours: (workingHoursDto.actualHours || []).map(toWorkingTimeSlot) }));
        return await workingHours.save();
    }
    async checkStaffAvailability(staffId, date, startTime, endTime) {
        const schedule = await this.getStaffSchedule(staffId, date);
        if (!schedule)
            return false;
        const dayOfWeek = date.getDay();
        const daySchedule = schedule.weeklySchedule.find(day => day.dayOfWeek === dayOfWeek);
        if (!daySchedule || !daySchedule.isWorkingDay)
            return false;
        const isWithinWorkingHours = daySchedule.workingHours.some(slot => slot.startTime <= startTime && slot.endTime >= endTime);
        if (!isWithinWorkingHours)
            return false;
        const existingAssignments = await this.staffAssignmentModel.find({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            assignmentDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
            status: { $in: ['scheduled', 'confirmed', 'in_progress'] }
        });
        for (const assignment of existingAssignments) {
            const assignmentStart = assignment.assignmentDetails.startTime;
            const assignmentEnd = assignment.assignmentDetails.endTime;
            if (this.timeOverlaps(startTime, endTime, assignmentStart, assignmentEnd)) {
                return false;
            }
        }
        return true;
    }
    async checkStaffSkill(staffId, serviceId) {
        const staff = await this.staffModel.findById(staffId);
        if (!staff)
            return false;
        return staff.skills.some(skill => skill.serviceId.toString() === serviceId && skill.isActive);
    }
    async selectBestStaff(availableStaff, serviceId, clientId) {
        const staffWithSkills = availableStaff.map(staff => {
            const skill = staff.skills.find(s => s.serviceId.toString() === serviceId);
            return {
                staff,
                skillLevel: skill ? this.getSkillLevelScore(skill.skillLevel) : 0
            };
        });
        staffWithSkills.sort((a, b) => b.skillLevel - a.skillLevel);
        return staffWithSkills[0].staff;
    }
    getSkillLevelScore(skillLevel) {
        const scores = {
            'beginner': 1,
            'intermediate': 2,
            'expert': 3,
            'master': 4
        };
        return scores[skillLevel] || 0;
    }
    async updateStaffStats(staffId) {
        const completedAssignments = await this.staffAssignmentModel.countDocuments({
            staffId: new mongoose_2.Types.ObjectId(staffId),
            status: 'completed'
        }).exec();
        await this.staffModel.findByIdAndUpdate(staffId, {
            completedAppointments: completedAssignments
        }).exec();
    }
    timeOverlaps(start1, end1, start2, end2) {
        return !(end1 <= start2 || start1 >= end2);
    }
    calculateMinutesDifference(startTime, endTime) {
        const start = this.timeToMinutes(startTime);
        const end = this.timeToMinutes(endTime);
        return end - start;
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
    async generateStaffId(businessId) {
        const count = await this.staffModel.countDocuments({
            businessId: new mongoose_2.Types.ObjectId(businessId)
        });
        return `STF${String(count + 1).padStart(4, '0')}`;
    }
    async createDefaultSchedule(staffId, businessId) {
        const defaultSchedule = [];
        for (let day = 1; day <= 5; day++) {
            defaultSchedule.push({
                dayOfWeek: day,
                isWorkingDay: true,
                workingHours: [{
                        startTime: '09:00',
                        endTime: '17:00',
                        isBreak: false
                    }],
                breaks: [{
                        startTime: '12:00',
                        endTime: '13:00',
                        isBreak: true,
                        breakType: 'lunch'
                    }],
                maxHoursPerDay: 8
            });
        }
        defaultSchedule.push({
            dayOfWeek: 6,
            isWorkingDay: true,
            workingHours: [{
                    startTime: '09:00',
                    endTime: '14:00',
                    isBreak: false
                }],
            breaks: [],
            maxHoursPerDay: 5
        });
        defaultSchedule.push({
            dayOfWeek: 0,
            isWorkingDay: false,
            workingHours: [],
            breaks: [],
            maxHoursPerDay: 0
        });
        await this.createStaffSchedule({
            staffId,
            businessId,
            effectiveDate: new Date(),
            weeklySchedule: defaultSchedule,
            scheduleType: 'regular',
            createdBy: staffId
        });
    }
    async deactivateOverlappingSchedules(staffId, effectiveDate, endDate) {
        const query = {
            staffId: new mongoose_2.Types.ObjectId(staffId),
            isActive: true,
            effectiveDate: { $lte: endDate || new Date('2099-12-31') }
        };
        if (endDate) {
            query.$or = [
                { endDate: null },
                { endDate: { $gte: effectiveDate } }
            ];
        }
        await this.staffScheduleModel.updateMany(query, {
            isActive: false,
            updatedAt: new Date()
        });
    }
};
StaffService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(staff_schema_1.Staff.name)),
    __param(1, (0, mongoose_1.InjectModel)(staff_schedule_schema_1.StaffSchedule.name)),
    __param(2, (0, mongoose_1.InjectModel)(staff_assignment_schema_1.StaffAssignment.name)),
    __param(3, (0, mongoose_1.InjectModel)(working_hours_schema_1.WorkingHours.name)),
    __metadata("design:paramtypes", [Object, Object, Object, Object])
], StaffService);
exports.StaffService = StaffService;
//# sourceMappingURL=staff.service.js.map