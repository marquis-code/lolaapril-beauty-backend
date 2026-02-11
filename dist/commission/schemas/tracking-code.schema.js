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
exports.TrackingCodeSchema = exports.TrackingCode = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let TrackingCode = class TrackingCode {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], TrackingCode.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], TrackingCode.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ['qr_code', 'direct_link', 'social_media', 'email_campaign']
    }),
    __metadata("design:type", String)
], TrackingCode.prototype, "codeType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], TrackingCode.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TrackingCode.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TrackingCode.prototype, "targetUrl", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true }),
    __metadata("design:type", Boolean)
], TrackingCode.prototype, "isActive", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], TrackingCode.prototype, "clickCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], TrackingCode.prototype, "bookingCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], TrackingCode.prototype, "conversionRate", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], TrackingCode.prototype, "expiresAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Schema.Types.Mixed }),
    __metadata("design:type", Object)
], TrackingCode.prototype, "metadata", void 0);
TrackingCode = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TrackingCode);
exports.TrackingCode = TrackingCode;
exports.TrackingCodeSchema = mongoose_1.SchemaFactory.createForClass(TrackingCode);
exports.TrackingCodeSchema.index({ businessId: 1 });
exports.TrackingCodeSchema.index({ code: 1 }, { unique: true });
exports.TrackingCodeSchema.index({ codeType: 1 });
exports.TrackingCodeSchema.index({ isActive: 1 });
//# sourceMappingURL=tracking-code.schema.js.map