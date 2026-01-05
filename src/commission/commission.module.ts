// // src/modules/commission/commission.module.ts
// import { Module, DynamicModule, Provider } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { CommissionController } from './controllers/commission.controller';
// import { QRCodeController } from './controllers/qr-code.controller';
// import { SourceTrackingService } from './services/source-tracking.service';
// import { CommissionCalculatorService } from './services/commission-calculator.service';
// import { CommissionService } from './services/commission.service';
// import { CommissionSchema } from './schemas/commission.schema';
// import { TrackingCodeSchema } from './schemas/tracking-code.schema';
// import { BookingSchema } from '../booking/schemas/booking.schema';
// import { PaymentSchema } from '../payment/schemas/payment.schema';
// import { AuthModule } from '../auth/auth.module';

// // NUCLEAR FIX: Define everything outside the decorator
// const schemas: any[] = [
//   { name: 'Commission', schema: CommissionSchema },
//   { name: 'TrackingCode', schema: TrackingCodeSchema },
//   { name: 'Booking', schema: BookingSchema },
//   { name: 'Payment', schema: PaymentSchema }
// ];

// const providers: Provider[] = [
//   SourceTrackingService, 
//   CommissionCalculatorService,
//   CommissionService
// ];

// const moduleConfig: any = {
//   imports: [
//     MongooseModule.forFeature(schemas),
//     AuthModule,
//   ],
//   controllers: [CommissionController, QRCodeController],
//   providers: providers,
//   exports: providers
// };

// @Module(moduleConfig)
// export class CommissionModule {}

// ==================== ABSOLUTE NUCLEAR OPTION ====================
// If NOTHING else works, use this factory pattern approach

// src/commission/commission.module.ts
import { Module, Global } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// @Global()
// @Module({})
// export class CommissionModule {
//   static register() {
//     // Import inside the function to avoid early evaluation
//     const { CommissionSchema } = require('./schemas/commission.schema');
//     const { TrackingCodeSchema } = require('./schemas/tracking-code.schema');
//     const { BookingSchema } = require('../booking/schemas/booking.schema');
//     const { PaymentSchema } = require('../payment/schemas/payment.schema');
//     const { CommissionController } = require('./controllers/commission.controller');
//     const { QRCodeController } = require('./controllers/qr-code.controller');
//     const { SourceTrackingService } = require('./services/source-tracking.service');
//     const { CommissionCalculatorService } = require('./services/commission-calculator.service');
//     const { CommissionService } = require('./services/commission.service');
//     const { AuthModule } = require('../auth/auth.module');

//     return {
//       module: CommissionModule,
//       imports: [
//         MongooseModule.forFeature([
//           { name: 'Commission', schema: CommissionSchema },
//           { name: 'TrackingCode', schema: TrackingCodeSchema },
//           { name: 'Booking', schema: BookingSchema },
//           { name: 'Payment', schema: PaymentSchema }
//         ]),
//         AuthModule,
//       ],
//       controllers: [CommissionController, QRCodeController],
//       providers: [
//         SourceTrackingService,
//         CommissionCalculatorService,
//         CommissionService
//       ],
//       exports: [
//         SourceTrackingService,
//         CommissionCalculatorService,
//         CommissionService
//       ]
//     };
//   }
// }

// ==================== Then in your app.module.ts ====================
// Change from:
// imports: [CommissionModule]
// 
// To:
// imports: [CommissionModule.register()]

// ==================== OR USE THIS EVEN SIMPLER VERSION ====================
// Just disable the decorator entirely and define manually

const commissionModuleMetadata: any = {
  imports: [
    MongooseModule.forFeature([
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

@Module(commissionModuleMetadata)
export class CommissionModule {}