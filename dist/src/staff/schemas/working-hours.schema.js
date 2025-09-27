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
exports.WorkingHoursSchema = exports.WorkingHours = exports.TimeSlot = void 0;
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
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TimeSlot.prototype, "breakType", void 0);
TimeSlot = __decorate([
    (0, mongoose_1.Schema)()
], TimeSlot);
exports.TimeSlot = TimeSlot;
let WorkingHours = class WorkingHours {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Staff', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WorkingHours.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WorkingHours.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], WorkingHours.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TimeSlot], required: true }),
    __metadata("design:type", Array)
], WorkingHours.prototype, "scheduledHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TimeSlot], default: [] }),
    __metadata("design:type", Array)
], WorkingHours.prototype, "actualHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], WorkingHours.prototype, "scheduledMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], WorkingHours.prototype, "actualMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], WorkingHours.prototype, "breakMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], WorkingHours.prototype, "overtimeMinutes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['present', 'absent', 'late', 'early_leave', 'sick', 'vacation'],
        default: 'present'
    }),
    __metadata("design:type", String)
], WorkingHours.prototype, "attendanceStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], WorkingHours.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WorkingHours.prototype, "checkedInBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], WorkingHours.prototype, "checkedOutBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], WorkingHours.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], WorkingHours.prototype, "updatedAt", void 0);
WorkingHours = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], WorkingHours);
exports.WorkingHours = WorkingHours;
exports.WorkingHoursSchema = mongoose_1.SchemaFactory.createForClass(WorkingHours);
exports.WorkingHoursSchema.index({ staffId: 1, date: 1 });
exports.WorkingHoursSchema.index({ businessId: 1, date: 1 });
//# sourceMappingURL=working-hours.schema.js.map