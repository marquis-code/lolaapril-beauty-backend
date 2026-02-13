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
exports.AppointmentSchema = exports.Appointment = exports.PaymentInstructions = exports.PaymentDetails = exports.ServiceDetails = exports.AppointmentDetails = exports.SelectedService = exports.AdditionalService = exports.SelectedOption = exports.BusinessInfo = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BusinessInfo = class BusinessInfo {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessInfo.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessInfo.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BusinessInfo.prototype, "rating", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BusinessInfo.prototype, "reviewCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessInfo.prototype, "address", void 0);
BusinessInfo = __decorate([
    (0, mongoose_1.Schema)()
], BusinessInfo);
exports.BusinessInfo = BusinessInfo;
let SelectedOption = class SelectedOption {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SelectedOption.prototype, "optionId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SelectedOption.prototype, "optionName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            hours: { type: Number, required: true },
            minutes: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], SelectedOption.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SelectedOption.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            currency: { type: String, required: true },
            amount: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], SelectedOption.prototype, "price", void 0);
SelectedOption = __decorate([
    (0, mongoose_1.Schema)()
], SelectedOption);
exports.SelectedOption = SelectedOption;
let AdditionalService = class AdditionalService {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AdditionalService.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AdditionalService.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            hours: { type: Number, required: true },
            minutes: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], AdditionalService.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AdditionalService.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            currency: { type: String, required: true },
            amount: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], AdditionalService.prototype, "price", void 0);
AdditionalService = __decorate([
    (0, mongoose_1.Schema)()
], AdditionalService);
exports.AdditionalService = AdditionalService;
let SelectedService = class SelectedService {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SelectedService.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SelectedService.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SelectedService.prototype, "serviceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: SelectedOption, required: true }),
    __metadata("design:type", SelectedOption)
], SelectedService.prototype, "selectedOption", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [AdditionalService], default: [] }),
    __metadata("design:type", Array)
], SelectedService.prototype, "additionalServices", void 0);
SelectedService = __decorate([
    (0, mongoose_1.Schema)()
], SelectedService);
exports.SelectedService = SelectedService;
let AppointmentDetails = class AppointmentDetails {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AppointmentDetails.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AppointmentDetails.prototype, "dayOfWeek", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AppointmentDetails.prototype, "startTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AppointmentDetails.prototype, "endTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AppointmentDetails.prototype, "duration", void 0);
AppointmentDetails = __decorate([
    (0, mongoose_1.Schema)()
], AppointmentDetails);
exports.AppointmentDetails = AppointmentDetails;
let ServiceDetails = class ServiceDetails {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceDetails.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceDetails.prototype, "serviceDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            currency: { type: String, required: true },
            amount: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], ServiceDetails.prototype, "price", void 0);
ServiceDetails = __decorate([
    (0, mongoose_1.Schema)()
], ServiceDetails);
exports.ServiceDetails = ServiceDetails;
let PaymentDetails = class PaymentDetails {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PaymentDetails.prototype, "paymentMethod", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            currency: { type: String, required: true },
            amount: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], PaymentDetails.prototype, "subtotal", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            currency: { type: String, required: true },
            amount: { type: Number, required: true },
            rate: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], PaymentDetails.prototype, "tax", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            currency: { type: String, required: true },
            amount: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], PaymentDetails.prototype, "total", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            payNow: {
                type: {
                    currency: { type: String, required: true },
                    amount: { type: Number, required: true },
                },
                required: true,
            },
            payAtVenue: {
                type: {
                    currency: { type: String, required: true },
                    amount: { type: Number, required: true },
                },
                required: true,
            },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], PaymentDetails.prototype, "paymentStatus", void 0);
PaymentDetails = __decorate([
    (0, mongoose_1.Schema)()
], PaymentDetails);
exports.PaymentDetails = PaymentDetails;
let PaymentInstructions = class PaymentInstructions {
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], PaymentInstructions.prototype, "paymentUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PaymentInstructions.prototype, "confirmationPolicy", void 0);
PaymentInstructions = __decorate([
    (0, mongoose_1.Schema)()
], PaymentInstructions);
exports.PaymentInstructions = PaymentInstructions;
let Appointment = class Appointment {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Client", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BusinessInfo, required: true }),
    __metadata("design:type", BusinessInfo)
], Appointment.prototype, "businessInfo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SelectedService], required: true }),
    __metadata("design:type", Array)
], Appointment.prototype, "selectedServices", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            hours: { type: Number, required: true },
            minutes: { type: Number, required: true },
        },
        required: true,
    }),
    __metadata("design:type", Object)
], Appointment.prototype, "totalDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Appointment.prototype, "selectedDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Appointment.prototype, "selectedTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: AppointmentDetails, required: true }),
    __metadata("design:type", AppointmentDetails)
], Appointment.prototype, "appointmentDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: ServiceDetails, required: true }),
    __metadata("design:type", ServiceDetails)
], Appointment.prototype, "serviceDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PaymentDetails, required: true }),
    __metadata("design:type", PaymentDetails)
], Appointment.prototype, "paymentDetails", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: PaymentInstructions }),
    __metadata("design:type", PaymentInstructions)
], Appointment.prototype, "paymentInstructions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ maxlength: 500 }),
    __metadata("design:type", String)
], Appointment.prototype, "customerNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ["pending_confirmation", "confirmed", "in_progress", "completed", "cancelled", "no_show"],
        default: "pending_confirmation",
    }),
    __metadata("design:type", String)
], Appointment.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "assignedStaff", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "cancellationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "checkInTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "checkOutTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "actualStartTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Appointment.prototype, "actualEndTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "appointmentNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Boolean)
], Appointment.prototype, "reminderSent", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Booking" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Appointment.prototype, "bookingId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Appointment.prototype, "bookingNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Appointment.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Appointment.prototype, "updatedAt", void 0);
Appointment = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Appointment);
exports.Appointment = Appointment;
exports.AppointmentSchema = mongoose_1.SchemaFactory.createForClass(Appointment);
exports.AppointmentSchema.index({ clientId: 1 });
exports.AppointmentSchema.index({ selectedDate: 1, selectedTime: 1 });
exports.AppointmentSchema.index({ status: 1 });
exports.AppointmentSchema.index({ assignedStaff: 1 });
exports.AppointmentSchema.index({ createdAt: -1 });
exports.AppointmentSchema.index({ "businessInfo.businessId": 1 });
//# sourceMappingURL=appointment.schema.js.map