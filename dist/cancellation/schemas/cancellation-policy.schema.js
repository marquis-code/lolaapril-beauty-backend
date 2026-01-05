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
exports.CancellationPolicySchema = exports.CancellationPolicy = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const PolicyRuleSchema = new mongoose_2.Schema({
    hoursBeforeAppointment: { type: Number, required: true },
    refundPercentage: { type: Number, required: true, default: 0 },
    penaltyPercentage: { type: Number, required: true, default: 0 },
    description: { type: String }
}, { _id: false });
let CancellationPolicy = class CancellationPolicy {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CancellationPolicy.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CancellationPolicy.prototype, "policyName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: false }),
    __metadata("design:type", Boolean)
], CancellationPolicy.prototype, "requiresDeposit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CancellationPolicy.prototype, "depositPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CancellationPolicy.prototype, "minimumDepositAmount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 24 }),
    __metadata("design:type", Number)
], CancellationPolicy.prototype, "cancellationWindowHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [PolicyRuleSchema], required: true }),
    __metadata("design:type", Array)
], CancellationPolicy.prototype, "rules", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CancellationPolicy.prototype, "allowSameDayCancellation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], CancellationPolicy.prototype, "sameDayRefundPercentage", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CancellationPolicy.prototype, "sendReminders", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: [24, 2] }),
    __metadata("design:type", Array)
], CancellationPolicy.prototype, "reminderHours", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 3 }),
    __metadata("design:type", Number)
], CancellationPolicy.prototype, "maxNoShowsBeforeDeposit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CancellationPolicy.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [mongoose_2.Schema.Types.ObjectId], ref: 'Service' }),
    __metadata("design:type", Array)
], CancellationPolicy.prototype, "applicableServices", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], CancellationPolicy.prototype, "description", void 0);
CancellationPolicy = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CancellationPolicy);
exports.CancellationPolicy = CancellationPolicy;
exports.CancellationPolicySchema = mongoose_1.SchemaFactory.createForClass(CancellationPolicy);
exports.CancellationPolicySchema.index({ businessId: 1 });
exports.CancellationPolicySchema.index({ isActive: 1 });
//# sourceMappingURL=cancellation-policy.schema.js.map