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
exports.SalonSettingsSchema = exports.SalonSettings = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let SalonSettings = class SalonSettings {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalonSettings.prototype, "salonName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalonSettings.prototype, "address", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalonSettings.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalonSettings.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SalonSettings.prototype, "website", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SalonSettings.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SalonSettings.prototype, "logo", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String] }),
    __metadata("design:type", Array)
], SalonSettings.prototype, "images", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalonSettings.prototype, "openingTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SalonSettings.prototype, "closingTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] }),
    __metadata("design:type", Array)
], SalonSettings.prototype, "workingDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 30 }),
    __metadata("design:type", Number)
], SalonSettings.prototype, "defaultBookingDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 15 }),
    __metadata("design:type", Number)
], SalonSettings.prototype, "bufferTime", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 24 }),
    __metadata("design:type", Number)
], SalonSettings.prototype, "cancellationPolicy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 50 }),
    __metadata("design:type", Number)
], SalonSettings.prototype, "cancellationFeePercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: "USD" }),
    __metadata("design:type", String)
], SalonSettings.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 8.5 }),
    __metadata("design:type", Number)
], SalonSettings.prototype, "taxRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SalonSettings.prototype, "allowOnlineBooking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SalonSettings.prototype, "requireEmailVerification", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], SalonSettings.prototype, "sendReminders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 24 }),
    __metadata("design:type", Number)
], SalonSettings.prototype, "reminderHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], SalonSettings.prototype, "socialMedia", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], SalonSettings.prototype, "paymentSettings", void 0);
SalonSettings = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], SalonSettings);
exports.SalonSettings = SalonSettings;
exports.SalonSettingsSchema = mongoose_1.SchemaFactory.createForClass(SalonSettings);
//# sourceMappingURL=salon-settings.schema.js.map