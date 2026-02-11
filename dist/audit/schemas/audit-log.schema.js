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
exports.AuditLogSchema = exports.AuditLog = exports.AuditEntity = exports.AuditAction = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const swagger_1 = require("@nestjs/swagger");
var AuditAction;
(function (AuditAction) {
    AuditAction["CREATE"] = "create";
    AuditAction["UPDATE"] = "update";
    AuditAction["DELETE"] = "delete";
    AuditAction["LOGIN"] = "login";
    AuditAction["LOGOUT"] = "logout";
    AuditAction["VIEW"] = "view";
    AuditAction["EXPORT"] = "export";
    AuditAction["IMPORT"] = "import";
})(AuditAction = exports.AuditAction || (exports.AuditAction = {}));
var AuditEntity;
(function (AuditEntity) {
    AuditEntity["USER"] = "user";
    AuditEntity["CLIENT"] = "client";
    AuditEntity["APPOINTMENT"] = "appointment";
    AuditEntity["BOOKING"] = "booking";
    AuditEntity["SERVICE"] = "service";
    AuditEntity["PAYMENT"] = "payment";
    AuditEntity["SALE"] = "sale";
    AuditEntity["VOUCHER"] = "voucher";
    AuditEntity["MEMBERSHIP"] = "membership";
    AuditEntity["CLIENT_MEMBERSHIP"] = "client_membership";
    AuditEntity["TEAM_MEMBER"] = "team_member";
    AuditEntity["SETTINGS"] = "settings";
    AuditEntity["COMMISSION"] = "commission";
    AuditEntity["FINANCIAL_REPORT"] = "financial_report";
    AuditEntity["ANALYTICS"] = "analytics";
})(AuditEntity = exports.AuditEntity || (exports.AuditEntity = {}));
let AuditLog = class AuditLog {
};
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User who performed the action" }),
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], AuditLog.prototype, "userId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Action performed", enum: AuditAction }),
    (0, mongoose_1.Prop)({ type: String, enum: AuditAction, required: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "action", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Entity affected", enum: AuditEntity }),
    (0, mongoose_1.Prop)({ type: String, enum: AuditEntity, required: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "entity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "ID of the affected entity" }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "entityId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Description of the action" }),
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], AuditLog.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Previous data before change" }),
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AuditLog.prototype, "previousData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "New data after change" }),
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AuditLog.prototype, "newData", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "IP address of the user" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AuditLog.prototype, "ipAddress", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "User agent string" }),
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], AuditLog.prototype, "userAgent", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: "Additional metadata" }),
    (0, mongoose_1.Prop)({ type: Object }),
    __metadata("design:type", Object)
], AuditLog.prototype, "metadata", void 0);
AuditLog = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], AuditLog);
exports.AuditLog = AuditLog;
exports.AuditLogSchema = mongoose_1.SchemaFactory.createForClass(AuditLog);
exports.AuditLogSchema.index({ userId: 1, createdAt: -1 });
exports.AuditLogSchema.index({ entity: 1, entityId: 1 });
exports.AuditLogSchema.index({ action: 1 });
exports.AuditLogSchema.index({ createdAt: -1 });
//# sourceMappingURL=audit-log.schema.js.map