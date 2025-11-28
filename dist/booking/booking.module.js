"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const booking_controller_1 = require("./controllers/booking.controller");
const booking_flow_controller_1 = require("./controllers/booking-flow.controller");
const booking_service_1 = require("./services/booking.service");
const booking_automation_service_1 = require("./services/booking-automation.service");
const booking_orchestrator_service_1 = require("./services/booking-orchestrator.service");
const booking_schema_1 = require("./schemas/booking.schema");
const booking_events_1 = require("./events/booking.events");
const tenant_middleware_1 = require("../tenant/middleware/tenant.middleware");
const availability_module_1 = require("../availability/availability.module");
const tenant_module_1 = require("../tenant/tenant.module");
const notification_module_1 = require("../notification/notification.module");
const appointment_module_1 = require("../appointment/appointment.module");
const payment_module_1 = require("../payment/payment.module");
const staff_module_1 = require("../staff/staff.module");
const service_module_1 = require("../service/service.module");
let BookingModule = class BookingModule {
    configure(consumer) {
        consumer
            .apply(tenant_middleware_1.TenantMiddleware)
            .forRoutes({ path: 'bookings/*', method: common_1.RequestMethod.ALL }, { path: 'booking-flow/*', method: common_1.RequestMethod.ALL });
    }
};
BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema }
            ]),
            event_emitter_1.EventEmitterModule.forRoot(),
            (0, common_1.forwardRef)(() => availability_module_1.AvailabilityModule),
            tenant_module_1.TenantModule,
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
            (0, common_1.forwardRef)(() => appointment_module_1.AppointmentModule),
            (0, common_1.forwardRef)(() => payment_module_1.PaymentModule),
            (0, common_1.forwardRef)(() => staff_module_1.StaffModule),
            (0, common_1.forwardRef)(() => service_module_1.ServiceModule),
        ],
        controllers: [booking_controller_1.BookingController, booking_flow_controller_1.BookingFlowController],
        providers: [
            booking_service_1.BookingService,
            booking_automation_service_1.BookingAutomationService,
            booking_orchestrator_service_1.BookingOrchestrator,
            booking_events_1.BookingEventHandler,
        ],
        exports: [
            booking_service_1.BookingService,
            booking_automation_service_1.BookingAutomationService,
            booking_orchestrator_service_1.BookingOrchestrator,
        ],
    })
], BookingModule);
exports.BookingModule = BookingModule;
//# sourceMappingURL=booking.module.js.map