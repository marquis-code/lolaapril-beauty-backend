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
exports.FinancialReportSchema = exports.FinancialReport = exports.SourceBreakdown = exports.CommissionBreakdown = exports.RevenueBreakdown = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
let RevenueBreakdown = class RevenueBreakdown {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], RevenueBreakdown.prototype, "grossRevenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], RevenueBreakdown.prototype, "platformCommissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], RevenueBreakdown.prototype, "processingFees", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], RevenueBreakdown.prototype, "refunds", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], RevenueBreakdown.prototype, "netRevenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], RevenueBreakdown.prototype, "businessPayout", void 0);
RevenueBreakdown = __decorate([
    (0, mongoose_1.Schema)()
], RevenueBreakdown);
exports.RevenueBreakdown = RevenueBreakdown;
let CommissionBreakdown = class CommissionBreakdown {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CommissionBreakdown.prototype, "marketplaceBookings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CommissionBreakdown.prototype, "marketplaceCommissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CommissionBreakdown.prototype, "directBookings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CommissionBreakdown.prototype, "commissionSavings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], CommissionBreakdown.prototype, "averageCommissionRate", void 0);
CommissionBreakdown = __decorate([
    (0, mongoose_1.Schema)()
], CommissionBreakdown);
exports.CommissionBreakdown = CommissionBreakdown;
let SourceBreakdown = class SourceBreakdown {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], SourceBreakdown.prototype, "sourceType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], SourceBreakdown.prototype, "bookingCount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], SourceBreakdown.prototype, "revenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], SourceBreakdown.prototype, "commissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], SourceBreakdown.prototype, "netRevenue", void 0);
SourceBreakdown = __decorate([
    (0, mongoose_1.Schema)()
], SourceBreakdown);
exports.SourceBreakdown = SourceBreakdown;
let FinancialReport = class FinancialReport {
};
__decorate([
    (0, mongoose_1.Prop)({ type: mongoose_2.Types.ObjectId, ref: 'Business', required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], FinancialReport.prototype, "businessId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], FinancialReport.prototype, "reportPeriod", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], FinancialReport.prototype, "startDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Date)
], FinancialReport.prototype, "endDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: RevenueBreakdown, required: true }),
    __metadata("design:type", RevenueBreakdown)
], FinancialReport.prototype, "revenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: CommissionBreakdown, required: true }),
    __metadata("design:type", CommissionBreakdown)
], FinancialReport.prototype, "commissions", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SourceBreakdown] }),
    __metadata("design:type", Array)
], FinancialReport.prototype, "sourceBreakdown", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], FinancialReport.prototype, "totalBookings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], FinancialReport.prototype, "completedBookings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], FinancialReport.prototype, "cancelledBookings", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], FinancialReport.prototype, "noShows", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, default: 0 }),
    __metadata("design:type", Number)
], FinancialReport.prototype, "averageBookingValue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], FinancialReport.prototype, "generatedAt", void 0);
FinancialReport = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], FinancialReport);
exports.FinancialReport = FinancialReport;
exports.FinancialReportSchema = mongoose_1.SchemaFactory.createForClass(FinancialReport);
exports.FinancialReportSchema.index({ businessId: 1, reportPeriod: 1 });
exports.FinancialReportSchema.index({ startDate: 1, endDate: 1 });
exports.FinancialReportSchema.index({ generatedAt: -1 });
//# sourceMappingURL=financial-report.schema.js.map