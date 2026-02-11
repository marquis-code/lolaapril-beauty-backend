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
exports.MembershipSchema = exports.Membership = exports.MembershipTier = exports.MembershipBenefit = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let MembershipBenefit = class MembershipBenefit {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MembershipBenefit.prototype, "benefitType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MembershipBenefit.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], MembershipBenefit.prototype, "discountPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MembershipBenefit.prototype, "freeServiceId", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], MembershipBenefit.prototype, "freeServiceName", void 0);
MembershipBenefit = __decorate([
    (0, mongoose_1.Schema)()
], MembershipBenefit);
exports.MembershipBenefit = MembershipBenefit;
let MembershipTier = class MembershipTier {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MembershipTier.prototype, "tierName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MembershipTier.prototype, "tierLevel", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MembershipTier.prototype, "minimumSpend", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], MembershipTier.prototype, "pointsMultiplier", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [MembershipBenefit], default: [] }),
    __metadata("design:type", Array)
], MembershipTier.prototype, "benefits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], MembershipTier.prototype, "tierColor", void 0);
MembershipTier = __decorate([
    (0, mongoose_1.Schema)()
], MembershipTier);
exports.MembershipTier = MembershipTier;
let Membership = class Membership {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Membership.prototype, "membershipName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Membership.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ["points_based", "tier_based", "subscription", "prepaid"],
    }),
    __metadata("design:type", String)
], Membership.prototype, "membershipType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [MembershipTier], default: [] }),
    __metadata("design:type", Array)
], Membership.prototype, "tiers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Membership.prototype, "pointsPerDollar", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 100 }),
    __metadata("design:type", Number)
], Membership.prototype, "pointsRedemptionValue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Membership.prototype, "subscriptionPrice", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Membership.prototype, "subscriptionDuration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [MembershipBenefit], default: [] }),
    __metadata("design:type", Array)
], Membership.prototype, "generalBenefits", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], Membership.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Membership.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Membership.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], Membership.prototype, "updatedAt", void 0);
Membership = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Membership);
exports.Membership = Membership;
exports.MembershipSchema = mongoose_1.SchemaFactory.createForClass(Membership);
exports.MembershipSchema.index({ membershipName: 1 });
exports.MembershipSchema.index({ membershipType: 1 });
exports.MembershipSchema.index({ isActive: 1 });
//# sourceMappingURL=membership.schema.js.map