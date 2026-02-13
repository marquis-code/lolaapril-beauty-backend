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
exports.BusinessSettingsSchema = exports.BusinessSettings = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const BusinessHoursSchema = {
    day: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isOpen: { type: Boolean, default: true }
};
const AppointmentStatusSchema = {
    statusName: { type: String, required: true },
    statusIcon: { type: String, required: true },
    statusColor: { type: String, required: true },
    characterLimit: { type: Number },
    isActive: { type: Boolean, default: true }
};
const CancellationReasonSchema = {
    name: { type: String, required: true },
    reasonType: { type: String, required: true, enum: ["client_initiated", "business_initiated", "external_factors"] },
    isActive: { type: Boolean, default: true }
};
const ResourceSchema = {
    name: { type: String, required: true },
    description: { type: String, required: true },
    isActive: { type: Boolean, default: true }
};
const BlockedTimeTypeSchema = {
    type: { type: String, required: true },
    typeIcon: { type: String, required: true },
    duration: { type: String, required: true },
    compensation: { type: String, required: true, enum: ["Paid", "Unpaid"] },
    isActive: { type: Boolean, default: true }
};
const PaymentMethodSchema = {
    name: { type: String, required: true },
    paymentType: { type: String, required: true, enum: ["cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet"] },
    enabled: { type: Boolean, default: true }
};
const ServiceChargeSchema = {
    basicInfo: {
        name: { type: String, required: true },
        description: { type: String, required: true }
    },
    settings: {
        applyServiceChargeOn: { type: String, required: true },
        automaticallyApplyDuringCheckout: { type: Boolean, default: false }
    },
    rateType: {
        type: { type: String, required: true, enum: ["Flat rate", "Percentage", "Both"] },
        amount: {
            currency: { type: String },
            value: { type: Number }
        },
        percentage: { type: Number },
        flatRate: {
            currency: { type: String },
            value: { type: Number }
        }
    },
    taxRate: {
        tax: { type: String, required: true },
        rate: { type: Number, required: true }
    },
    isActive: { type: Boolean, default: true }
};
const TaxSchema = {
    taxName: { type: String, required: true },
    taxRate: { type: Number, required: true },
    isActive: { type: Boolean, default: true }
};
const ClosedPeriodSchema = {
    startDate: { type: String, required: true },
    endDate: { type: String, required: true },
    description: { type: String, required: true },
    businessClosed: { type: Boolean, default: true },
    onlineBookingBlocked: { type: Boolean, default: true }
};
let BusinessSettings = class BusinessSettings {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], BusinessSettings.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "businessEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            countryCode: { type: String, required: true },
            number: { type: String, required: true }
        },
        required: true
    }),
    __metadata("design:type", Object)
], BusinessSettings.prototype, "businessPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            street: { type: String, required: true },
            city: { type: String, required: true },
            region: { type: String, required: true },
            postcode: { type: String, required: true },
            country: { type: String, required: true }
        },
        required: true
    }),
    __metadata("design:type", Object)
], BusinessSettings.prototype, "businessAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [BusinessHoursSchema], required: true }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "businessHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [AppointmentStatusSchema], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "appointmentStatuses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [CancellationReasonSchema], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "cancellationReasons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ResourceSchema], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "resources", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [BlockedTimeTypeSchema], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "blockedTimeTypes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [PaymentMethodSchema], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "paymentMethods", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ServiceChargeSchema], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "serviceCharges", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [TaxSchema], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "taxes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ClosedPeriodSchema], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "closedPeriods", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "NGN" }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "defaultCurrency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, default: "Africa/Lagos" }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 15 }),
    __metadata("design:type", Number)
], BusinessSettings.prototype, "defaultAppointmentDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, default: 2 }),
    __metadata("design:type", Number)
], BusinessSettings.prototype, "bookingWindowHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], BusinessSettings.prototype, "allowOnlineBooking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Boolean, default: true }),
    __metadata("design:type", Boolean)
], BusinessSettings.prototype, "requireClientConfirmation", void 0);
BusinessSettings = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BusinessSettings);
exports.BusinessSettings = BusinessSettings;
exports.BusinessSettingsSchema = mongoose_1.SchemaFactory.createForClass(BusinessSettings);
exports.BusinessSettingsSchema.index({ businessId: 1 }, { unique: true });
exports.BusinessSettingsSchema.index({ businessName: 1 });
exports.BusinessSettingsSchema.index({ businessEmail: 1 });
//# sourceMappingURL=business-settings.schema.js.map