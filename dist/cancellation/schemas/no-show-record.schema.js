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
exports.NoShowRecordSchema = exports.NoShowRecord = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let NoShowRecord = class NoShowRecord {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NoShowRecord.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NoShowRecord.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Appointment', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NoShowRecord.prototype, "appointmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Booking' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], NoShowRecord.prototype, "bookingId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], NoShowRecord.prototype, "appointmentDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], NoShowRecord.prototype, "scheduledTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], NoShowRecord.prototype, "bookedAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], NoShowRecord.prototype, "penaltyCharged", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], NoShowRecord.prototype, "penaltyPaid", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], NoShowRecord.prototype, "wasDeposited", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], NoShowRecord.prototype, "depositAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], NoShowRecord.prototype, "depositForfeited", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['no_show', 'late_cancellation', 'same_day_cancellation'],
        required: true
    }),
    __metadata("design:type", String)
], NoShowRecord.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], NoShowRecord.prototype, "clientContactAttempts", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], NoShowRecord.prototype, "notes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], NoShowRecord.prototype, "recordedAt", void 0);
NoShowRecord = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], NoShowRecord);
exports.NoShowRecord = NoShowRecord;
exports.NoShowRecordSchema = mongoose_1.SchemaFactory.createForClass(NoShowRecord);
exports.NoShowRecordSchema.index({ clientId: 1 });
exports.NoShowRecordSchema.index({ businessId: 1 });
exports.NoShowRecordSchema.index({ appointmentId: 1 });
exports.NoShowRecordSchema.index({ type: 1 });
exports.NoShowRecordSchema.index({ recordedAt: -1 });
//# sourceMappingURL=no-show-record.schema.js.map