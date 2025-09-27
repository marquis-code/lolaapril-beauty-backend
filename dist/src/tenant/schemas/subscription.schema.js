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
exports.SubscriptionSchema = exports.Subscription = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let Subscription = class Subscription {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Subscription.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['basic', 'standard', 'premium', 'enterprise', 'trial']
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
exports.SubscriptionSchema = mongoose_1.SchemaFactory.createForClass(Subscription);
exports.SubscriptionSchema.index({ businessId: 1 });
exports.SubscriptionSchema.index({ status: 1 });
exports.SubscriptionSchema.index({ endDate: 1 });
//# sourceMappingURL=subscription.schema.js.map