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
exports.StaffAvailabilitySchema = exports.StaffAvailability = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const business_hours_schema_1 = require("./business-hours.schema");
let StaffAvailability = class StaffAvailability {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAvailability.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAvailability.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], StaffAvailability.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [business_hours_schema_1.TimeSlot], required: true }),
    __metadata("design:type", Array)
], StaffAvailability.prototype, "availableSlots", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [business_hours_schema_1.TimeSlot], default: [] }),
    __metadata("design:type", Array)
], StaffAvailability.prototype, "blockedSlots", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['available', 'unavailable', 'partial'],
        default: 'available'
    }),
    __metadata("design:type", String)
], StaffAvailability.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], StaffAvailability.prototype, "reason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], StaffAvailability.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], StaffAvailability.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], StaffAvailability.prototype, "updatedAt", void 0);
StaffAvailability = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], StaffAvailability);
exports.StaffAvailability = StaffAvailability;
exports.StaffAvailabilitySchema = mongoose_1.SchemaFactory.createForClass(StaffAvailability);
exports.StaffAvailabilitySchema.index({ staffId: 1, date: 1 });
exports.StaffAvailabilitySchema.index({ businessId: 1, date: 1 });
//# sourceMappingURL=staff-availability.schema.js.map