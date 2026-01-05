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
exports.ClientReliabilitySchema = exports.ClientReliability = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let ClientReliability = class ClientReliability {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'User', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ClientReliability.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Business' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ClientReliability.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 100 }),
    __metadata("design:type", Number)
], ClientReliability.prototype, "reliabilityScore", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientReliability.prototype, "totalBookings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientReliability.prototype, "completedBookings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientReliability.prototype, "cancelledBookings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientReliability.prototype, "noShowCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientReliability.prototype, "lateCancellations", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientReliability.prototype, "onTimeArrivals", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientReliability.prototype, "lateArrivals", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ClientReliability.prototype, "lastNoShowDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ClientReliability.prototype, "lastCancellationDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ClientReliability.prototype, "lastCompletedDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ClientReliability.prototype, "requiresDeposit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], ClientReliability.prototype, "isBlacklisted", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ClientReliability.prototype, "blacklistReason", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ClientReliability.prototype, "blacklistedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientReliability.prototype, "lifetimeValue", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ClientReliability.prototype, "riskLevel", void 0);
ClientReliability = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ClientReliability);
exports.ClientReliability = ClientReliability;
exports.ClientReliabilitySchema = mongoose_1.SchemaFactory.createForClass(ClientReliability);
exports.ClientReliabilitySchema.index({ clientId: 1, businessId: 1 }, { unique: true });
exports.ClientReliabilitySchema.index({ reliabilityScore: 1 });
exports.ClientReliabilitySchema.index({ requiresDeposit: 1 });
exports.ClientReliabilitySchema.index({ isBlacklisted: 1 });
//# sourceMappingURL=client-reliability.schema.js.map