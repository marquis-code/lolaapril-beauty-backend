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
const source_tracking_service_1 = require("./services/source-tracking.service");
const client_reliability_service_1 = require("./services/client-reliability.service");
const client_reliability_schema_1 = require("./schemas/client-reliability.schema");
const availability_module_1 = require("../availability/availability.module");
const business_module_1 = require("../business/business.module");
const notification_module_1 = require("../notification/notification.module");
const appointment_module_1 = require("../appointment/appointment.module");
const payment_module_1 = require("../payment/payment.module");
const staff_module_1 = require("../staff/staff.module");
const service_module_1 = require("../service/service.module");
const commission_module_1 = require("../commission/commission.module");
const cancellation_module_1 = require("../cancellation/cancellation.module");
const analytics_module_1 = require("../analytics/analytics.module");
const subscription_module_1 = require("../subscription/subscription.module");
let BookingModule = class BookingModule {
};
BookingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: client_reliability_schema_1.ClientReliability.name, schema: client_reliability_schema_1.ClientReliabilitySchema }
            ]),
            subscription_module_1.SubscriptionModule,
            business_module_1.BusinessModule,
            event_emitter_1.EventEmitterModule.forRoot(),
            (0, common_1.forwardRef)(() => availability_module_1.AvailabilityModule),
            (0, common_1.forwardRef)(() => notification_module_1.NotificationModule),
            (0, common_1.forwardRef)(() => appointment_module_1.AppointmentModule),
            (0, common_1.forwardRef)(() => payment_module_1.PaymentModule),
            (0, common_1.forwardRef)(() => staff_module_1.StaffModule),
            (0, common_1.forwardRef)(() => service_module_1.ServiceModule),
            (0, common_1.forwardRef)(() => commission_module_1.CommissionModule),
            (0, common_1.forwardRef)(() => cancellation_module_1.CancellationModule),
            (0, common_1.forwardRef)(() => analytics_module_1.AnalyticsModule)
        ],
        controllers: [
            booking_controller_1.BookingController,
            booking_flow_controller_1.BookingFlowController
        ],
        providers: [
            booking_service_1.BookingService,
            booking_automation_service_1.BookingAutomationService,
            booking_orchestrator_service_1.BookingOrchestrator,
            booking_events_1.BookingEventHandler,
            source_tracking_service_1.SourceTrackingService,
            client_reliability_service_1.ClientReliabilityService
        ],
        exports: [
            booking_service_1.BookingService,
            booking_automation_service_1.BookingAutomationService,
            booking_orchestrator_service_1.BookingOrchestrator,
            source_tracking_service_1.SourceTrackingService,
            client_reliability_service_1.ClientReliabilityService
        ],
    })
], BookingModule);
exports.BookingModule = BookingModule;
//# sourceMappingURL=booking.module.js.map