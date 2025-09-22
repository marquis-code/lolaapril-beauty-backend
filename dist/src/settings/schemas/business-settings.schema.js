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
exports.BusinessSettingsSchema = exports.BusinessSettings = exports.ClosedPeriod = exports.Tax = exports.ServiceCharge = exports.PaymentMethod = exports.BlockedTimeType = exports.Resource = exports.CancellationReason = exports.AppointmentStatus = exports.BusinessHours = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let BusinessHours = class BusinessHours {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessHours.prototype, "day", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessHours.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessHours.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BusinessHours.prototype, "isOpen", void 0);
BusinessHours = __decorate([
    (0, mongoose_1.Schema)()
], BusinessHours);
exports.BusinessHours = BusinessHours;
let AppointmentStatus = class AppointmentStatus {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], AppointmentStatus.prototype, "statusName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AppointmentStatus.prototype, "statusIcon", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AppointmentStatus.prototype, "statusColor", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], AppointmentStatus.prototype, "characterLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], AppointmentStatus.prototype, "isActive", void 0);
AppointmentStatus = __decorate([
    (0, mongoose_1.Schema)()
], AppointmentStatus);
exports.AppointmentStatus = AppointmentStatus;
let CancellationReason = class CancellationReason {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CancellationReason.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ["client_initiated", "business_initiated", "external_factors"] }),
    __metadata("design:type", String)
], CancellationReason.prototype, "reasonType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CancellationReason.prototype, "isActive", void 0);
CancellationReason = __decorate([
    (0, mongoose_1.Schema)()
], CancellationReason);
exports.CancellationReason = CancellationReason;
let Resource = class Resource {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Resource.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Resource.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Resource.prototype, "isActive", void 0);
Resource = __decorate([
    (0, mongoose_1.Schema)()
], Resource);
exports.Resource = Resource;
let BlockedTimeType = class BlockedTimeType {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BlockedTimeType.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BlockedTimeType.prototype, "typeIcon", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BlockedTimeType.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ["Paid", "Unpaid"] }),
    __metadata("design:type", String)
], BlockedTimeType.prototype, "compensation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BlockedTimeType.prototype, "isActive", void 0);
BlockedTimeType = __decorate([
    (0, mongoose_1.Schema)()
], BlockedTimeType);
exports.BlockedTimeType = BlockedTimeType;
let PaymentMethod = class PaymentMethod {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: ["cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet"] }),
    __metadata("design:type", String)
], PaymentMethod.prototype, "paymentType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], PaymentMethod.prototype, "enabled", void 0);
PaymentMethod = __decorate([
    (0, mongoose_1.Schema)()
], PaymentMethod);
exports.PaymentMethod = PaymentMethod;
let ServiceCharge = class ServiceCharge {
};
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            name: { type: String, required: true },
            description: { type: String, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], ServiceCharge.prototype, "basicInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            applyServiceChargeOn: { type: String, required: true },
            automaticallyApplyDuringCheckout: { type: Boolean, default: false },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], ServiceCharge.prototype, "settings", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            type: { type: String, required: true, enum: ["Flat rate", "Percentage", "Both"] },
            amount: {
                type: {
                    currency: { type: String },
                    value: { type: Number },
                },
            },
            percentage: { type: Number },
            flatRate: {
                type: {
                    currency: { type: String },
                    value: { type: Number },
                },
            },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], ServiceCharge.prototype, "rateType", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            tax: { type: String, required: true },
            rate: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], ServiceCharge.prototype, "taxRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ServiceCharge.prototype, "isActive", void 0);
ServiceCharge = __decorate([
    (0, mongoose_1.Schema)()
], ServiceCharge);
exports.ServiceCharge = ServiceCharge;
let Tax = class Tax {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Tax.prototype, "taxName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Tax.prototype, "taxRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Tax.prototype, "isActive", void 0);
Tax = __decorate([
    (0, mongoose_1.Schema)()
], Tax);
exports.Tax = Tax;
let ClosedPeriod = class ClosedPeriod {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClosedPeriod.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClosedPeriod.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClosedPeriod.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ClosedPeriod.prototype, "businessClosed", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], ClosedPeriod.prototype, "onlineBookingBlocked", void 0);
ClosedPeriod = __decorate([
    (0, mongoose_1.Schema)()
], ClosedPeriod);
exports.ClosedPeriod = ClosedPeriod;
let BusinessSettings = class BusinessSettings {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "businessEmail", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            countryCode: { type: String, required: true },
            number: { type: String, required: true },
        },
        required: true,
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
            country: { type: String, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], BusinessSettings.prototype, "businessAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [BusinessHours], required: true }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "businessHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [AppointmentStatus], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "appointmentStatuses", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [CancellationReason], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "cancellationReasons", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Resource], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "resources", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [BlockedTimeType], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "blockedTimeTypes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [PaymentMethod], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "paymentMethods", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ServiceCharge], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "serviceCharges", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Tax], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "taxes", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ClosedPeriod], default: [] }),
    __metadata("design:type", Array)
], BusinessSettings.prototype, "closedPeriods", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "NGN" }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "defaultCurrency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "Africa/Lagos" }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 15 }),
    __metadata("design:type", Number)
], BusinessSettings.prototype, "defaultAppointmentDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 2 }),
    __metadata("design:type", Number)
], BusinessSettings.prototype, "bookingWindowHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BusinessSettings.prototype, "allowOnlineBooking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BusinessSettings.prototype, "requireClientConfirmation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], BusinessSettings.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], BusinessSettings.prototype, "updatedAt", void 0);
BusinessSettings = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], BusinessSettings);
exports.BusinessSettings = BusinessSettings;
exports.BusinessSettingsSchema = mongoose_1.SchemaFactory.createForClass(BusinessSettings);
exports.BusinessSettingsSchema.index({ businessName: 1 });
exports.BusinessSettingsSchema.index({ businessEmail: 1 });
//# sourceMappingURL=business-settings.schema.js.map