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
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffScheduleSchema = exports.StaffSchedule = exports.DailySchedule = exports.TimeSlot = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TimeSlot = class TimeSlot {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TimeSlot.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TimeSlot.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], TimeSlot.prototype, "isBreak", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], TimeSlot.prototype, "breakType", void 0);
TimeSlot = __decorate([
    (0, mongoose_1.Schema)()
], TimeSlot);
exports.TimeSlot = TimeSlot;
let DailySchedule = class DailySchedule {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySchedule.prototype, "dayOfWeek", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], DailySchedule.prototype, "isWorkingDay", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TimeSlot], default: [] }),
    __metadata("design:type", Array)
], DailySchedule.prototype, "workingHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TimeSlot], default: [] }),
    __metadata("design:type", Array)
], DailySchedule.prototype, "breaks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 8 }),
    __metadata("design:type", Number)
], DailySchedule.prototype, "maxHoursPerDay", void 0);
DailySchedule = __decorate([
    (0, mongoose_1.Schema)()
], DailySchedule);
exports.DailySchedule = DailySchedule;
let StaffSchedule = class StaffSchedule {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Staff', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffSchedule.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffSchedule.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], StaffSchedule.prototype, "effectiveDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], StaffSchedule.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [DailySchedule], required: true }),
    __metadata("design:type", Array)
], StaffSchedule.prototype, "weeklySchedule", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['regular', 'temporary', 'override'],
        default: 'regular'
    }),
    __metadata("design:type", String)
], StaffSchedule.prototype, "scheduleType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffSchedule.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], StaffSchedule.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffSchedule.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], StaffSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], StaffSchedule.prototype, "updatedAt", void 0);
StaffSchedule = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], StaffSchedule);
exports.StaffSchedule = StaffSchedule;
exports.StaffScheduleSchema = mongoose_1.SchemaFactory.createForClass(StaffSchedule);
exports.StaffScheduleSchema.index({ staffId: 1, effectiveDate: 1 });
exports.StaffScheduleSchema.index({ businessId: 1, isActive: 1 });
//# sourceMappingURL=staff-schedule.schema.js.map