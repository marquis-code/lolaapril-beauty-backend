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
exports.CustomDomainSchema = exports.CustomDomain = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let CustomDomain = class CustomDomain {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true, index: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CustomDomain.prototype, "tenantId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], CustomDomain.prototype, "domain", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomDomain.prototype, "subdomain", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'verified', 'failed'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], CustomDomain.prototype, "verificationStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: ['pending', 'active', 'failed', 'expired'],
        default: 'pending'
    }),
    __metadata("design:type", String)
], CustomDomain.prototype, "sslStatus", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [{
                type: { type: String, required: true },
                name: { type: String, required: true },
                value: { type: String, required: true },
                verified: { type: Boolean, default: false },
            }],
        default: []
    }),
    __metadata("design:type", Array)
], CustomDomain.prototype, "dnsRecords", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], CustomDomain.prototype, "verifiedAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'User' }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], CustomDomain.prototype, "requestedBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], CustomDomain.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], CustomDomain.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], CustomDomain.prototype, "updatedAt", void 0);
CustomDomain = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CustomDomain);
exports.CustomDomain = CustomDomain;
exports.CustomDomainSchema = mongoose_1.SchemaFactory.createForClass(CustomDomain);
exports.CustomDomainSchema.index({ tenantId: 1 });
exports.CustomDomainSchema.index({ domain: 1 }, { unique: true });
exports.CustomDomainSchema.index({ verificationStatus: 1 });
//# sourceMappingURL=custom-domain.schema.js.map