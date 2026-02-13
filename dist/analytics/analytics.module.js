"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const analytics_controller_1 = require("./analytics.controller");
const analytics_service_1 = require("./analytics.service");
const business_module_1 = require("../business/business.module");
const financial_report_schema_1 = require("./schemas/financial-report.schema");
const booking_schema_1 = require("../booking/schemas/booking.schema");
const payment_schema_1 = require("../payment/schemas/payment.schema");
const commission_schema_1 = require("../commission/schemas/commission.schema");
const traffic_analytics_schema_1 = require("./schemas/traffic-analytics.schema");
const audit_module_1 = require("../audit/audit.module");
let AnalyticsModule = class AnalyticsModule {
};
AnalyticsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: financial_report_schema_1.FinancialReport.name, schema: financial_report_schema_1.FinancialReportSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: payment_schema_1.Payment.name, schema: payment_schema_1.PaymentSchema },
                { name: commission_schema_1.Commission.name, schema: commission_schema_1.CommissionSchema },
                { name: traffic_analytics_schema_1.TrafficAnalytics.name, schema: traffic_analytics_schema_1.TrafficAnalyticsSchema },
            ]),
            audit_module_1.AuditModule,
            business_module_1.BusinessModule,
        ],
        controllers: [analytics_controller_1.AnalyticsController],
        providers: [analytics_service_1.AnalyticsService],
        exports: [analytics_service_1.AnalyticsService],
    })
], AnalyticsModule);
exports.AnalyticsModule = AnalyticsModule;
//# sourceMappingURL=analytics.module.js.map