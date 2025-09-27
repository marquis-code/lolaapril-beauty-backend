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
exports.TenantConfigSchema = exports.SubscriptionSchema = exports.BusinessSchema = exports.TenantConfig = exports.Subscription = exports.Business = exports.BusinessSettings = exports.BusinessContact = exports.BusinessAddress = void 0;
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
            tiktok: { type: String, required: false }
        },
        default: {}
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
    (0, mongoose_1.Prop)({ default: 'Africa/Lagos' }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "timezone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'NGN' }),
    __metadata("design:type", String)
], BusinessSettings.prototype, "currency", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 'en' }),
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
            marketing: { type: Boolean, default: false }
        },
        default: {}
    }),
    __metadata("design:type", Object)
], BusinessSettings.prototype, "notificationSettings", void 0);
BusinessSettings = __decorate([
    (0, mongoose_1.Schema)()
], BusinessSettings);
exports.BusinessSettings = BusinessSettings;
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
        enum: ['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other']
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
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Business.prototype, "ownerId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Types.ObjectId], ref: 'User', default: [] }),
    __metadata("design:type", Array)
], Business.prototype, "adminIds", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['active', 'inactive', 'suspended', 'trial'],
        default: 'trial'
    }),
    __metadata("design:type", String)
], Business.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Business.prototype, "trialEndsAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Subscription' }),
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
                bankCode: String
            }
        },
        default: {}
    }),
    __metadata("design:type", Object)
], Business.prototype, "businessDocuments", void 0);
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
let Subscription = class Subscription {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Subscription.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['basic', 'standard', 'premium', 'enterprise']
    }),
    __metadata("design:type", String)
], Subscription.prototype, "planType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Subscription.prototype, "planName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Subscription.prototype, "monthlyPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Subscription.prototype, "yearlyPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['monthly', 'yearly']
    }),
    __metadata("design:type", String)
], Subscription.prototype, "billingCycle", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Subscription.prototype, "nextBillingDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['active', 'cancelled', 'expired', 'past_due'],
        default: 'active'
    }),
    __metadata("design:type", String)
], Subscription.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            maxStaff: Number,
            maxServices: Number,
            maxAppointmentsPerMonth: Number,
            maxStorageGB: Number,
            features: {
                onlineBooking: Boolean,
                analytics: Boolean,
                marketing: Boolean,
                inventory: Boolean,
                multiLocation: Boolean,
                apiAccess: Boolean,
                customBranding: Boolean,
                advancedReports: Boolean
            }
        },
        required: true
    }),
    __metadata("design:type", Object)
], Subscription.prototype, "limits", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Subscription.prototype, "trialDays", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Subscription.prototype, "autoRenew", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Subscription.prototype, "cancellationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Subscription.prototype, "cancellationReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Subscription.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Subscription.prototype, "updatedAt", void 0);
Subscription = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Subscription);
exports.Subscription = Subscription;
let TenantConfig = class TenantConfig {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, unique: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TenantConfig.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            primary: String,
            secondary: String,
            accent: String,
            background: String,
            text: String
        },
        default: {
            primary: '#007bff',
            secondary: '#6c757d',
            accent: '#28a745',
            background: '#ffffff',
            text: '#333333'
        }
    }),
    __metadata("design:type", Object)
], TenantConfig.prototype, "brandColors", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            fontFamily: String,
            fontSize: String,
            headerFont: String
        },
        default: {
            fontFamily: 'Inter, sans-serif',
            fontSize: '14px',
            headerFont: 'Inter, sans-serif'
        }
    }),
    __metadata("design:type", Object)
], TenantConfig.prototype, "typography", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            showBusinessLogo: { type: Boolean, default: true },
            showPoweredBy: { type: Boolean, default: true },
            customCSS: String,
            favicon: String
        },
        default: {}
    }),
    __metadata("design:type", Object)
], TenantConfig.prototype, "customization", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: {
            emailProvider: {
                type: String,
                enum: ['sendgrid', 'mailgun', 'ses', 'smtp'],
                default: 'smtp'
            },
            emailConfig: {
                apiKey: String,
                host: String,
                port: Number,
                username: String,
                password: String,
                fromEmail: String,
                fromName: String
            },
            smsProvider: {
                type: String,
                enum: ['twilio', 'nexmo', 'africas_talking', 'custom'],
                default: 'twilio'
            },
            smsConfig: {
                apiKey: String,
                apiSecret: String,
                senderId: String
            },
            paymentProvider: {
                type: String,
                enum: ['paystack', 'flutterwave', 'stripe', 'razorpay'],
                default: 'paystack'
            },
            paymentConfig: {
                publicKey: String,
                secretKey: String,
                webhookSecret: String
            }
        },
        default: {}
    }),
    __metadata("design:type", Object)
], TenantConfig.prototype, "integrations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], TenantConfig.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], TenantConfig.prototype, "updatedAt", void 0);
TenantConfig = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TenantConfig);
exports.TenantConfig = TenantConfig;
exports.BusinessSchema = mongoose_1.SchemaFactory.createForClass(Business);
exports.SubscriptionSchema = mongoose_1.SchemaFactory.createForClass(Subscription);
exports.TenantConfigSchema = mongoose_1.SchemaFactory.createForClass(TenantConfig);
exports.BusinessSchema.index({ subdomain: 1 });
exports.BusinessSchema.index({ ownerId: 1 });
exports.BusinessSchema.index({ status: 1 });
exports.SubscriptionSchema.index({ businessId: 1 });
exports.SubscriptionSchema.index({ status: 1 });
exports.SubscriptionSchema.index({ endDate: 1 });
exports.TenantConfigSchema.index({ businessId: 1 });
//# sourceMappingURL=tenant.schema.js.map