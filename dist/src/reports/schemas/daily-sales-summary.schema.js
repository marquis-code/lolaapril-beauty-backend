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
exports.DailySalesSummarySchema = exports.DailySalesSummary = exports.PaymentMethodSummary = exports.StaffSummary = exports.ServiceSummary = void 0;
const mongoose_1 = require("@nestjs/mongoose");
let ServiceSummary = class ServiceSummary {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceSummary.prototype, "serviceId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], ServiceSummary.prototype, "serviceName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ServiceSummary.prototype, "quantity", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], ServiceSummary.prototype, "revenue", void 0);
ServiceSummary = __decorate([
    (0, mongoose_1.Schema)()
], ServiceSummary);
exports.ServiceSummary = ServiceSummary;
let StaffSummary = class StaffSummary {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StaffSummary.prototype, "staffId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], StaffSummary.prototype, "staffName", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], StaffSummary.prototype, "appointmentsCompleted", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], StaffSummary.prototype, "revenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], StaffSummary.prototype, "commission", void 0);
StaffSummary = __decorate([
    (0, mongoose_1.Schema)()
], StaffSummary);
exports.StaffSummary = StaffSummary;
let PaymentMethodSummary = class PaymentMethodSummary {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], PaymentMethodSummary.prototype, "method", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PaymentMethodSummary.prototype, "count", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], PaymentMethodSummary.prototype, "amount", void 0);
PaymentMethodSummary = __decorate([
    (0, mongoose_1.Schema)()
], PaymentMethodSummary);
exports.PaymentMethodSummary = PaymentMethodSummary;
let DailySalesSummary = class DailySalesSummary {
};
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], DailySalesSummary.prototype, "date", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "totalRevenue", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "totalAppointments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "completedAppointments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "cancelledAppointments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "noShowAppointments", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "newClients", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "returningClients", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [ServiceSummary], default: [] }),
    __metadata("design:type", Array)
], DailySalesSummary.prototype, "servicesSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [StaffSummary], default: [] }),
    __metadata("design:type", Array)
], DailySalesSummary.prototype, "staffSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [PaymentMethodSummary], default: [] }),
    __metadata("design:type", Array)
], DailySalesSummary.prototype, "paymentMethodsSummary", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "averageTicketSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "totalTax", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "totalDiscount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", Number)
], DailySalesSummary.prototype, "totalServiceCharge", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], DailySalesSummary.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: Date.now }),
    __metadata("design:type", Date)
], DailySalesSummary.prototype, "updatedAt", void 0);
DailySalesSummary = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], DailySalesSummary);
exports.DailySalesSummary = DailySalesSummary;
exports.DailySalesSummarySchema = mongoose_1.SchemaFactory.createForClass(DailySalesSummary);
exports.DailySalesSummarySchema.index({ date: 1 });
exports.DailySalesSummarySchema.index({ createdAt: -1 });
//# sourceMappingURL=daily-sales-summary.schema.js.map