"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const commission_controller_1 = require("./controllers/commission.controller");
const qr_code_controller_1 = require("./controllers/qr-code.controller");
const source_tracking_service_1 = require("./services/source-tracking.service");
const commission_calculator_service_1 = require("./services/commission-calculator.service");
const commission_service_1 = require("./services/commission.service");
const commission_schema_1 = require("./schemas/commission.schema");
const tracking_code_schema_1 = require("./schemas/tracking-code.schema");
const booking_schema_1 = require("../booking/schemas/booking.schema");
const payment_schema_1 = require("../payment/schemas/payment.schema");
let CommissionModule = class CommissionModule {
};
CommissionModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: commission_schema_1.Commission.name, schema: commission_schema_1.CommissionSchema },
                { name: tracking_code_schema_1.TrackingCode.name, schema: tracking_code_schema_1.TrackingCodeSchema },
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: payment_schema_1.Payment.name, schema: payment_schema_1.PaymentSchema }
            ]),
        ],
        controllers: [commission_controller_1.CommissionController, qr_code_controller_1.QRCodeController],
        providers: [
            source_tracking_service_1.SourceTrackingService,
            commission_calculator_service_1.CommissionCalculatorService,
            commission_service_1.CommissionService
        ],
        exports: [
            source_tracking_service_1.SourceTrackingService,
            commission_calculator_service_1.CommissionCalculatorService,
            commission_service_1.CommissionService
        ]
    })
], CommissionModule);
exports.CommissionModule = CommissionModule;
//# sourceMappingURL=commission.module.js.map