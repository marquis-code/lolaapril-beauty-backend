"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancellationModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const event_emitter_1 = require("@nestjs/event-emitter");
const cancellation_policy_schema_1 = require("./schemas/cancellation-policy.schema");
const no_show_record_schema_1 = require("./schemas/no-show-record.schema");
const client_reliability_schema_1 = require("./schemas/client-reliability.schema");
const cancellation_controller_1 = require("./controllers/cancellation.controller");
const cancellation_policy_service_1 = require("./services/cancellation-policy.service");
const no_show_management_service_1 = require("./services/no-show-management.service");
const appointment_module_1 = require("../appointment/appointment.module");
const payment_module_1 = require("../payment/payment.module");
let CancellationModule = class CancellationModule {
};
CancellationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: cancellation_policy_schema_1.CancellationPolicy.name, schema: cancellation_policy_schema_1.CancellationPolicySchema },
                { name: no_show_record_schema_1.NoShowRecord.name, schema: no_show_record_schema_1.NoShowRecordSchema },
                { name: client_reliability_schema_1.ClientReliability.name, schema: client_reliability_schema_1.ClientReliabilitySchema }
            ]),
            event_emitter_1.EventEmitterModule.forRoot(),
            (0, common_1.forwardRef)(() => appointment_module_1.AppointmentModule),
            (0, common_1.forwardRef)(() => payment_module_1.PaymentModule)
        ],
        controllers: [cancellation_controller_1.CancellationController],
        providers: [
            cancellation_policy_service_1.CancellationPolicyService,
            no_show_management_service_1.NoShowManagementService
        ],
        exports: [
            cancellation_policy_service_1.CancellationPolicyService,
            no_show_management_service_1.NoShowManagementService
        ]
    })
], CancellationModule);
exports.CancellationModule = CancellationModule;
//# sourceMappingURL=cancellation.module.js.map