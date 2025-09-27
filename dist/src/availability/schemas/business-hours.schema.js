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
exports.BusinessHoursSchema = exports.BusinessHours = exports.DaySchedule = exports.TimeSlot = void 0;
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
TimeSlot = __decorate([
    (0, mongoose_1.Schema)()
], TimeSlot);
exports.TimeSlot = TimeSlot;
let DaySchedule = class DaySchedule {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DaySchedule.prototype, "dayOfWeek", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], DaySchedule.prototype, "isOpen", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TimeSlot], default: [] }),
    __metadata("design:type", Array)
], DaySchedule.prototype, "timeSlots", void 0);
DaySchedule = __decorate([
    (0, mongoose_1.Schema)()
], DaySchedule);
exports.DaySchedule = DaySchedule;
let BusinessHours = class BusinessHours {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BusinessHours.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [DaySchedule], required: true }),
    __metadata("design:type", Array)
], BusinessHours.prototype, "weeklySchedule", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Date], default: [] }),
    __metadata("design:type", Array)
], BusinessHours.prototype, "holidays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Date], default: [] }),
    __metadata("design:type", Array)
], BusinessHours.prototype, "specialOpenDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 30 }),
    __metadata("design:type", Number)
], BusinessHours.prototype, "defaultSlotDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BusinessHours.prototype, "bufferTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], BusinessHours.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], BusinessHours.prototype, "updatedAt", void 0);
BusinessHours = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BusinessHours);
exports.BusinessHours = BusinessHours;
exports.BusinessHoursSchema = mongoose_1.SchemaFactory.createForClass(BusinessHours);
exports.BusinessHoursSchema.index({ businessId: 1 });
//# sourceMappingURL=business-hours.schema.js.map