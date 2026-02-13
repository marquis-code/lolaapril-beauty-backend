"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppointmentModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const appointment_service_1 = require("./appointment.service");
const appointment_controller_1 = require("./appointment.controller");
const appointment_schema_1 = require("./schemas/appointment.schema");
const audit_module_1 = require("../audit/audit.module");
const payment_module_1 = require("../payment/payment.module");
const staff_module_1 = require("../staff/staff.module");
const notification_module_1 = require("../notification/notification.module");
const sales_module_1 = require("../sales/sales.module");
const integration_module_1 = require("../integration/integration.module");
const scheduled_reminder_schema_1 = require("../jobs/schemas/scheduled-reminder.schema");
const client_module_1 = require("../client/client.module");
let AppointmentModule = class AppointmentModule {
};
AppointmentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: appointment_schema_1.Appointment.name, schema: appointment_schema_1.AppointmentSchema },
                { name: scheduled_reminder_schema_1.ScheduledReminder.name, schema: scheduled_reminder_schema_1.ScheduledReminderSchema },
            ]),
            audit_module_1.AuditModule,
            (0, common_1.forwardRef)(() => payment_module_1.PaymentModule),
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
            (0, common_1.forwardRef)(() => staff_module_1.StaffModule),
            (0, common_1.forwardRef)(() => sales_module_1.SalesModule),
            integration_module_1.IntegrationModule,
            client_module_1.ClientModule,
        ],
        controllers: [appointment_controller_1.AppointmentController],
        providers: [appointment_service_1.AppointmentService],
        exports: [appointment_service_1.AppointmentService],
    })
], AppointmentModule);
exports.AppointmentModule = AppointmentModule;
//# sourceMappingURL=appointment.module.js.map