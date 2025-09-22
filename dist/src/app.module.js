"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const throttler_1 = require("@nestjs/throttler");
const config_1 = require("@nestjs/config");
const client_module_1 = require("./client/client.module");
const service_module_1 = require("./service/service.module");
const appointment_module_1 = require("./appointment/appointment.module");
const booking_module_1 = require("./booking/booking.module");
const payment_module_1 = require("./payment/payment.module");
const sales_module_1 = require("./sales/sales.module");
const team_module_1 = require("./team/team.module");
const settings_module_1 = require("./settings/settings.module");
const voucher_module_1 = require("./voucher/voucher.module");
const membership_module_1 = require("./membership/membership.module");
const reports_module_1 = require("./reports/reports.module");
const auth_module_1 = require("./auth/auth.module");
const audit_module_1 = require("./audit/audit.module");
const upload_module_1 = require("./upload/upload.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URL'),
                    useNewUrlParser: true,
                    useUnifiedTopology: true,
                }),
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 10,
                },
            ]),
            auth_module_1.AuthModule,
            audit_module_1.AuditModule,
            upload_module_1.UploadModule,
            client_module_1.ClientModule,
            service_module_1.ServiceModule,
            appointment_module_1.AppointmentModule,
            booking_module_1.BookingModule,
            payment_module_1.PaymentModule,
            sales_module_1.SalesModule,
            team_module_1.TeamModule,
            settings_module_1.SettingsModule,
            voucher_module_1.VoucherModule,
            membership_module_1.MembershipModule,
            reports_module_1.ReportsModule,
        ],
        providers: [],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map