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
exports.ClientMembershipSchema = exports.ClientMembership = exports.PointsTransaction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let PointsTransaction = class PointsTransaction {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PointsTransaction.prototype, "transactionType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PointsTransaction.prototype, "points", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PointsTransaction.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Sale" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PointsTransaction.prototype, "saleId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Appointment" }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], PointsTransaction.prototype, "appointmentId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], PointsTransaction.prototype, "transactionDate", void 0);
PointsTransaction = __decorate([
    (0, mongoose_1.Schema)()
], PointsTransaction);
exports.PointsTransaction = PointsTransaction;
let ClientMembership = class ClientMembership {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Client", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ClientMembership.prototype, "clientId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "Membership", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], ClientMembership.prototype, "membershipId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ClientMembership.prototype, "membershipNumber", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], ClientMembership.prototype, "joinDate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ClientMembership.prototype, "expiryDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientMembership.prototype, "totalPoints", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientMembership.prototype, "totalSpent", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], ClientMembership.prototype, "currentTier", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], ClientMembership.prototype, "tierProgress", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [PointsTransaction], default: [] }),
    __metadata("design:type", Array)
], ClientMembership.prototype, "pointsHistory", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ["active", "inactive", "expired", "suspended"],
        default: "active",
    }),
    __metadata("design:type", String)
], ClientMembership.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], ClientMembership.prototype, "lastActivity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ClientMembership.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], ClientMembership.prototype, "updatedAt", void 0);
ClientMembership = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], ClientMembership);
exports.ClientMembership = ClientMembership;
exports.ClientMembershipSchema = mongoose_1.SchemaFactory.createForClass(ClientMembership);
exports.ClientMembershipSchema.index({ clientId: 1 });
exports.ClientMembershipSchema.index({ membershipId: 1 });
exports.ClientMembershipSchema.index({ membershipNumber: 1 });
exports.ClientMembershipSchema.index({ status: 1 });
exports.ClientMembershipSchema.index({ joinDate: -1 });
//# sourceMappingURL=client-membership.schema.js.map