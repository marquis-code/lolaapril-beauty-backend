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
const commissionModuleMetadata = {
    imports: [
        mongoose_1.MongooseModule.forFeature([
            { name: 'Commission', schema: require('./schemas/commission.schema').CommissionSchema },
            { name: 'TrackingCode', schema: require('./schemas/tracking-code.schema').TrackingCodeSchema },
            { name: 'Booking', schema: require('../booking/schemas/booking.schema').BookingSchema },
            { name: 'Payment', schema: require('../payment/schemas/payment.schema').PaymentSchema }
        ]),
        require('../auth/auth.module').AuthModule,
    ],
    controllers: [
        require('./controllers/commission.controller').CommissionController,
        require('./controllers/qr-code.controller').QRCodeController
    ],
    providers: [
        require('./services/source-tracking.service').SourceTrackingService,
        require('./services/commission-calculator.service').CommissionCalculatorService,
        require('./services/commission.service').CommissionService
    ],
    exports: [
        require('./services/source-tracking.service').SourceTrackingService,
        require('./services/commission-calculator.service').CommissionCalculatorService,
        require('./services/commission.service').CommissionService
    ]
};
let CommissionModule = class CommissionModule {
};
CommissionModule = __decorate([
    (0, common_1.Module)(commissionModuleMetadata)
], CommissionModule);
exports.CommissionModule = CommissionModule;
//# sourceMappingURL=commission.module.js.map