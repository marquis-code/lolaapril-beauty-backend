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
exports.ConsultationAvailabilitySchema = exports.ConsultationAvailability = exports.ConsultationBookingSchema = exports.ConsultationBooking = exports.ConsultationPackageSchema = exports.ConsultationPackage = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ConsultationPackage = class ConsultationPackage {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ConsultationPackage.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ConsultationPackage.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ConsultationPackage.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 0 }),
    __metadata("design:type", Number)
], ConsultationPackage.prototype, "price", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, min: 1 }),
    __metadata("design:type", Number)
], ConsultationPackage.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ConsultationPackage.prototype, "isActive", void 0);
ConsultationPackage = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ConsultationPackage);
exports.ConsultationPackage = ConsultationPackage;
exports.ConsultationPackageSchema = mongoose_1.SchemaFactory.createForClass(ConsultationPackage);
let ConsultationBooking = class ConsultationBooking {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ConsultationBooking.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ConsultationBooking.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'ConsultationPackage', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ConsultationBooking.prototype, "packageId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], ConsultationBooking.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], ConsultationBooking.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], ConsultationBooking.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    }),
    __metadata("design:type", String)
], ConsultationBooking.prototype, "paymentStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ConsultationBooking.prototype, "meetingLink", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ConsultationBooking.prototype, "calendarEventId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ConsultationBooking.prototype, "paymentReference", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ConsultationBooking.prototype, "reminderSentCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ConsultationBooking.prototype, "thankYouSent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ConsultationBooking.prototype, "marketingFollowUpSent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ConsultationBooking.prototype, "notes", void 0);
ConsultationBooking = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ConsultationBooking);
exports.ConsultationBooking = ConsultationBooking;
exports.ConsultationBookingSchema = mongoose_1.SchemaFactory.createForClass(ConsultationBooking);
let ConsultationTimeSlot = class ConsultationTimeSlot {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ConsultationTimeSlot.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ConsultationTimeSlot.prototype, "endTime", void 0);
ConsultationTimeSlot = __decorate([
    (0, mongoose_1.Schema)()
], ConsultationTimeSlot);
let ConsultationDaySchedule = class ConsultationDaySchedule {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ConsultationDaySchedule.prototype, "dayOfWeek", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ConsultationDaySchedule.prototype, "isOpen", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ConsultationTimeSlot], default: [] }),
    __metadata("design:type", Array)
], ConsultationDaySchedule.prototype, "timeSlots", void 0);
ConsultationDaySchedule = __decorate([
    (0, mongoose_1.Schema)()
], ConsultationDaySchedule);
let ConsultationAvailability = class ConsultationAvailability {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ConsultationAvailability.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ConsultationDaySchedule], required: true }),
    __metadata("design:type", Array)
], ConsultationAvailability.prototype, "weeklySchedule", void 0);
ConsultationAvailability = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ConsultationAvailability);
exports.ConsultationAvailability = ConsultationAvailability;
exports.ConsultationAvailabilitySchema = mongoose_1.SchemaFactory.createForClass(ConsultationAvailability);
exports.ConsultationBookingSchema.index({ businessId: 1, startTime: 1 });
exports.ConsultationBookingSchema.index({ clientId: 1, startTime: 1 });
exports.ConsultationPackageSchema.index({ businessId: 1 });
//# sourceMappingURL=consultation.schema.js.map