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
exports.VoucherSchema = exports.Voucher = exports.VoucherRestrictions = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let VoucherRestrictions = class VoucherRestrictions {
};
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: "Service" }], default: [] }),
    __metadata("design:type", Array)
], VoucherRestrictions.prototype, "applicableServices", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: "Category" }], default: [] }),
    __metadata("design:type", Array)
], VoucherRestrictions.prototype, "applicableCategories", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VoucherRestrictions.prototype, "minimumSpend", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], VoucherRestrictions.prototype, "maximumDiscount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Types.ObjectId, ref: "Service" }], default: [] }),
    __metadata("design:type", Array)
], VoucherRestrictions.prototype, "excludedServices", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false }),
    __metadata("design:type", Boolean)
], VoucherRestrictions.prototype, "firstTimeClientsOnly", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [String], default: [] }),
    __metadata("design:type", Array)
], VoucherRestrictions.prototype, "applicableDays", void 0);
VoucherRestrictions = __decorate([
    (0, mongoose_1.Schema)()
], VoucherRestrictions);
exports.VoucherRestrictions = VoucherRestrictions;
let Voucher = class Voucher {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], Voucher.prototype, "voucherCode", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Voucher.prototype, "voucherName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], Voucher.prototype, "description", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ["percentage", "fixed_amount", "service_discount", "buy_one_get_one"],
    }),
    __metadata("design:type", String)
], Voucher.prototype, "discountType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], Voucher.prototype, "discountValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Voucher.prototype, "validFrom", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], Voucher.prototype, "validUntil", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], Voucher.prototype, "usageLimit", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0 }),
    __metadata("design:type", Number)
], Voucher.prototype, "usedCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1 }),
    __metadata("design:type", Number)
], Voucher.prototype, "usagePerClient", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: VoucherRestrictions, default: {} }),
    __metadata("design:type", VoucherRestrictions)
], Voucher.prototype, "restrictions", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        required: true,
        enum: ["active", "inactive", "expired", "used_up"],
        default: "active",
    }),
    __metadata("design:type", String)
], Voucher.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: "User", required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Voucher.prototype, "createdBy", void 0);
Voucher = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Voucher);
exports.Voucher = Voucher;
exports.VoucherSchema = mongoose_1.SchemaFactory.createForClass(Voucher);
exports.VoucherSchema.index({ voucherCode: 1 });
exports.VoucherSchema.index({ status: 1 });
exports.VoucherSchema.index({ validFrom: 1, validUntil: 1 });
exports.VoucherSchema.index({ createdAt: -1 });
//# sourceMappingURL=voucher.schema.js.map