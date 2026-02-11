"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobsModule = void 0;
const common_1 = require("@nestjs/common");
const bull_1 = require("@nestjs/bull");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const jobs_service_1 = require("./jobs.service");
const payout_processor_1 = require("./processors/payout.processor");
const report_generation_processor_1 = require("./processors/report-generation.processor");
const booking_cron_service_1 = require("./booking-cron.service");
const post_completion_cron_service_1 = require("./post-completion-cron.service");
const business_reminder_cron_service_1 = require("./business-reminder-cron.service");
const scheduled_reminder_schema_1 = require("./schemas/scheduled-reminder.schema");
const appointment_schema_1 = require("../appointment/schemas/appointment.schema");
const email_templates_service_1 = require("../notification/templates/email-templates.service");
const payment_schema_1 = require("../payment/schemas/payment.schema");
const booking_schema_1 = require("../booking/schemas/booking.schema");
const notification_module_1 = require("../notification/notification.module");
const cache_module_1 = require("../cache/cache.module");
const commission_module_1 = require("../commission/commission.module");
const integration_module_1 = require("../integration/integration.module");
let JobsModule = class JobsModule {
};
JobsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule,
            bull_1.BullModule.forRootAsync({
                imports: [config_1.ConfigModule],
                useFactory: async (configService) => ({
                    redis: {
                        host: configService.get('REDIS_HOST', 'localhost'),
                        port: configService.get('REDIS_PORT', 6379),
                        password: configService.get('REDIS_PASSWORD'),
                    },
                    defaultJobOptions: {
                        attempts: 3,
                        backoff: {
                            type: 'exponential',
                            delay: 1000,
                        },
                        removeOnComplete: 100,
                        removeOnFail: 200,
                    },
                }),
                inject: [config_1.ConfigService],
            }),
            bull_1.BullModule.registerQueue({ name: 'payouts' }, { name: 'reports' }, { name: 'notifications' }, { name: 'analytics' }),
            mongoose_1.MongooseModule.forFeature([
                { name: payment_schema_1.Payment.name, schema: payment_schema_1.PaymentSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: scheduled_reminder_schema_1.ScheduledReminder.name, schema: scheduled_reminder_schema_1.ScheduledReminderSchema },
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
            ]),
            notification_module_1.NotificationModule,
            cache_module_1.CacheModule,
            commission_module_1.CommissionModule,
            integration_module_1.IntegrationModule,
        ],
        providers: [
            jobs_service_1.JobsService,
            payout_processor_1.PayoutProcessor,
            report_generation_processor_1.ReportGenerationProcessor,
            booking_cron_service_1.BookingCronService,
            post_completion_cron_service_1.PostCompletionCronService,
            business_reminder_cron_service_1.BusinessReminderCronService,
            email_templates_service_1.EmailTemplatesService,
        ],
        exports: [jobs_service_1.JobsService, bull_1.BullModule],
    })
], JobsModule);
exports.JobsModule = JobsModule;
//# sourceMappingURL=jobs.module.js.map