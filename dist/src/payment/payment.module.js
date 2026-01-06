"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const payment_service_1 = require("./payment.service");
const config_1 = require("@nestjs/config");
const payment_controller_1 = require("./payment.controller");
const payment_schema_1 = require("./schemas/payment.schema");
const booking_schema_1 = require("../booking/schemas/booking.schema");
const audit_module_1 = require("../audit/audit.module");
const notification_module_1 = require("../notification/notification.module");
const commission_module_1 = require("../commission/commission.module");
const integration_module_1 = require("../integration/integration.module");
const jobs_module_1 = require("../jobs/jobs.module");
const cache_module_1 = require("../cache/cache.module");
const pricing_module_1 = require("../pricing/pricing.module");
let PaymentModule = class PaymentModule {
};
PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [mongoose_1.MongooseModule.forFeature([{ name: payment_schema_1.Payment.name, schema: payment_schema_1.PaymentSchema }, { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema }]),
            config_1.ConfigModule,
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
            audit_module_1.AuditModule,
            pricing_module_1.PricingModule,
            commission_module_1.CommissionModule,
            integration_module_1.IntegrationModule,
            jobs_module_1.JobsModule,
            cache_module_1.CacheModule,
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService],
        exports: [payment_service_1.PaymentService],
    })
], PaymentModule);
exports.PaymentModule = PaymentModule;
//# sourceMappingURL=payment.module.js.map