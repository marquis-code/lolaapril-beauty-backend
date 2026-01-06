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
exports.BusinessSchema = exports.Business = exports.BusinessHours = exports.BusinessSettings = exports.BusinessContact = exports.BusinessAddress = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let BusinessAddress = class BusinessAddress {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessAddress.prototype, "street", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessAddress.prototype, "city", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessAddress.prototype, "state", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessAddress.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BusinessAddress.prototype, "postalCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BusinessAddress.prototype, "latitude", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], BusinessAddress.prototype, "longitude", void 0);
BusinessAddress = __decorate([
    (0, mongoose_1.Schema)()
], BusinessAddress);
exports.BusinessAddress = BusinessAddress;
let BusinessContact = class BusinessContact {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessContact.prototype, "primaryPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BusinessContact.prototype, "secondaryPhone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessContact.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BusinessContact.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            facebook: { type: String, required: false },
            instagram: { type: String, required: false },
            twitter: { type: String, required: false },
            tiktok: { type: String, required: false },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], BusinessContact.prototype, "socialMedia", void 0);
BusinessContact = __decorate([
    (0, mongoose_1.Schema)()
], BusinessContact);
exports.BusinessContact = BusinessContact;
let BusinessSettings = class BusinessSettings {
};
__decorate([
    (0, mongoose_1.Prop)({ default: "Africa/Lagos" }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "NGN" }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "en" }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "language", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 30 }),
    __metadata("design:type", Number)
], BusinessSettings.prototype, "defaultAppointmentDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 15 }),
    __metadata("design:type", Number)
], BusinessSettings.prototype, "bufferTimeBetweenAppointments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 24 }),
    __metadata("design:type", Number)
], BusinessSettings.prototype, "cancellationPolicyHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 7 }),
    __metadata("design:type", Number)
], BusinessSettings.prototype, "advanceBookingDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BusinessSettings.prototype, "allowOnlineBooking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], BusinessSettings.prototype, "requireEmailVerification", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], BusinessSettings.prototype, "requirePhoneVerification", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 10 }),
    __metadata("design:type", Number)
], BusinessSettings.prototype, "taxRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], BusinessSettings.prototype, "serviceCharge", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            booking_confirmation: { type: Boolean, default: true },
            payment_reminders: { type: Boolean, default: true },
            appointment_reminders: { type: Boolean, default: true },
            marketing: { type: Boolean, default: false },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], BusinessSettings.prototype, "notificationSettings", void 0);
BusinessSettings = __decorate([
    (0, mongoose_1.Schema)()
], BusinessSettings);
exports.BusinessSettings = BusinessSettings;
let BusinessHours = class BusinessHours {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], BusinessHours.prototype, "day", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Boolean)
], BusinessHours.prototype, "isOpen", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BusinessHours.prototype, "openTime", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BusinessHours.prototype, "closeTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ openTime: String, closeTime: String }], default: [] }),
    __metadata("design:type", Array)
], BusinessHours.prototype, "breaks", void 0);
BusinessHours = __decorate([
    (0, mongoose_1.Schema)()
], BusinessHours);
exports.BusinessHours = BusinessHours;
let Business = class Business {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Business.prototype, "businessName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Business.prototype, "subdomain", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Business.prototype, "businessDescription", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ["salon", "spa", "barbershop", "beauty_clinic", "wellness_center", "other"],
    }),
    __metadata("design:type", String)
], Business.prototype, "businessType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Business.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], Business.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BusinessAddress, required: true }),
    __metadata("design:type", BusinessAddress)
], Business.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BusinessContact, required: true }),
    __metadata("design:type", BusinessContact)
], Business.prototype, "contact", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BusinessSettings, default: {} }),
    __metadata("design:type", BusinessSettings)
], Business.prototype, "settings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [BusinessHours], default: [] }),
    __metadata("design:type", Array)
], Business.prototype, "businessHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Business.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: "User", default: [] }),
    __metadata("design:type", Array)
], Business.prototype, "adminIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: "User", default: [] }),
    __metadata("design:type", Array)
], Business.prototype, "staffIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ["active", "inactive", "suspended", "trial", "expired"],
        default: "trial",
    }),
    __metadata("design:type", String)
], Business.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Business.prototype, "trialEndsAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Subscription" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Business.prototype, "activeSubscription", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            businessRegistration: String,
            taxIdentification: String,
            bankAccount: {
                accountName: String,
                accountNumber: String,
                bankName: String,
                bankCode: String,
            },
        },
        default: {},
    }),
    __metadata("design:type", Object)
], Business.prototype, "businessDocuments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Business.prototype, "totalAppointments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Business.prototype, "totalRevenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Business.prototype, "totalClients", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Business.prototype, "averageRating", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Business.prototype, "totalReviews", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Business.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Business.prototype, "updatedAt", void 0);
Business = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Business);
exports.Business = Business;
exports.BusinessSchema = mongoose_1.SchemaFactory.createForClass(Business);
exports.BusinessSchema.index({ subdomain: 1 });
exports.BusinessSchema.index({ ownerId: 1 });
exports.BusinessSchema.index({ status: 1 });
exports.BusinessSchema.index({ businessType: 1 });
exports.BusinessSchema.index({ adminIds: 1 });
exports.BusinessSchema.index({ staffIds: 1 });
//# sourceMappingURL=business.schema.js.map