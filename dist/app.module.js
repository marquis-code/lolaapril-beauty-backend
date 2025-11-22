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
const config_1 = require("@nestjs/config");
const mongoose_1 = require("@nestjs/mongoose");
const schedule_1 = require("@nestjs/schedule");
const event_emitter_1 = require("@nestjs/event-emitter");
const core_1 = require("@nestjs/core");
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
const availability_module_1 = require("./availability/availability.module");
const notification_module_1 = require("./notification/notification.module");
const tenant_module_1 = require("./tenant/tenant.module");
const staff_module_1 = require("./staff/staff.module");
const audit_interceptor_1 = require("./audit/interceptors/audit.interceptor");
let AppModule = class AppModule {
    configure(consumer) {
    }
};
AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                envFilePath: '.env'
            }),
            mongoose_1.MongooseModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get('MONGO_URL'),
                    connectionFactory: (connection) => {
                        connection.on('connected', () => {
                            console.log('✅ MongoDB connected successfully');
                            console.log(`📍 Database: ${connection.name}`);
                            console.log(`🔗 Host: ${connection.host}:${connection.port}`);
                        });
                        connection.on('error', (error) => {
                            console.error('❌ MongoDB connection error:', error.message);
                        });
                        connection.on('disconnected', () => {
                            console.log('⚠️  MongoDB disconnected');
                        });
                        return connection;
                    },
                }),
            }),
            schedule_1.ScheduleModule.forRoot(),
            event_emitter_1.EventEmitterModule.forRoot(),
            tenant_module_1.TenantModule,
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
            availability_module_1.AvailabilityModule,
            notification_module_1.NotificationModule,
            staff_module_1.StaffModule,
        ],
        providers: [
            {
                provide: core_1.APP_INTERCEPTOR,
                useClass: audit_interceptor_1.AuditInterceptor,
            }
        ],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map