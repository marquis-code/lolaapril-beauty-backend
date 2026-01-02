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
exports.CommissionSchema = exports.Commission = exports.BookingSourceTracking = exports.CommissionRule = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CommissionRule = class CommissionRule {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CommissionRule.prototype, "ruleName", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['marketplace', 'direct_link', 'qr_code', 'business_website',
            'google_search', 'social_media', 'referral', 'walk_in', 'phone']
    }),
    __metadata("design:type", String)
], CommissionRule.prototype, "sourceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CommissionRule.prototype, "commissionRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: true }),
    __metadata("design:type", Boolean)
], CommissionRule.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CommissionRule.prototype, "description", void 0);
CommissionRule = __decorate([
    (0, mongoose_1.Schema)()
], CommissionRule);
exports.CommissionRule = CommissionRule;
let BookingSourceTracking = class BookingSourceTracking {
};
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['marketplace', 'direct_link', 'qr_code', 'business_website',
            'google_search', 'social_media', 'referral', 'walk_in', 'phone']
    }),
    __metadata("design:type", String)
], BookingSourceTracking.prototype, "sourceType", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingSourceTracking.prototype, "sourceIdentifier", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingSourceTracking.prototype, "trackingCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingSourceTracking.prototype, "referralCode", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingSourceTracking.prototype, "utmSource", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingSourceTracking.prototype, "utmMedium", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingSourceTracking.prototype, "utmCampaign", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], BookingSourceTracking.prototype, "trackedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingSourceTracking.prototype, "ipAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingSourceTracking.prototype, "userAgent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], BookingSourceTracking.prototype, "referrerUrl", void 0);
BookingSourceTracking = __decorate([
    (0, mongoose_1.Schema)()
], BookingSourceTracking);
exports.BookingSourceTracking = BookingSourceTracking;
let Commission = class Commission {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Booking', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Commission.prototype, "bookingId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Commission.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Commission.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Payment' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Commission.prototype, "paymentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: BookingSourceTracking, required: true }),
    __metadata("design:type", BookingSourceTracking)
], Commission.prototype, "sourceTracking", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Commission.prototype, "bookingAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], Commission.prototype, "isCommissionable", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Commission.prototype, "commissionRate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Commission.prototype, "commissionAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Commission.prototype, "platformFee", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Commission.prototype, "businessPayout", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Commission.prototype, "commissionReason", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Commission.prototype, "isFirstTimeClient", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Commission.prototype, "isMarketplaceAcquired", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], Commission.prototype, "wasDisputed", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Commission.prototype, "disputeReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Commission.prototype, "disputeResolvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        enum: ['pending', 'calculated', 'approved', 'paid', 'disputed', 'waived'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], Commission.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Commission.prototype, "calculatedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Commission.prototype, "approvedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], Commission.prototype, "paidAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Commission.prototype, "approvedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], Commission.prototype, "notes", void 0);
Commission = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Commission);
exports.Commission = Commission;
exports.CommissionSchema = mongoose_1.SchemaFactory.createForClass(Commission);
exports.CommissionSchema.index({ bookingId: 1 });
exports.CommissionSchema.index({ businessId: 1 });
exports.CommissionSchema.index({ clientId: 1 });
exports.CommissionSchema.index({ status: 1 });
exports.CommissionSchema.index({ isCommissionable: 1 });
exports.CommissionSchema.index({ calculatedAt: 1 });
exports.CommissionSchema.index({ 'sourceTracking.sourceType': 1 });
//# sourceMappingURL=commission.schema.js.map