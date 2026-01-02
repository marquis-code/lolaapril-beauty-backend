// import { Module, forwardRef, Provider } from '@nestjs/common'
// import { MongooseModule } from '@nestjs/mongoose'
// import { CommissionController } from './controllers/commission.controller'
// import { QRCodeController } from './controllers/qr-code.controller'
// import { SourceTrackingService } from './services/source-tracking.service'
// import { CommissionCalculatorService } from './services/commission-calculator.service'
// import { Commission, CommissionSchema } from './schemas/commission.schema'
// import { TrackingCode, TrackingCodeSchema } from './schemas/tracking-code.schema'
// import { Booking, BookingSchema } from '../booking/schemas/booking.schema'

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Commission.name, schema: CommissionSchema },
//       { name: TrackingCode.name, schema: TrackingCodeSchema },
//       { name: Booking.name, schema: BookingSchema }
//     ]),
//   ],
//   controllers: [CommissionController as any, QRCodeController as any],
//   providers: [SourceTrackingService as any, CommissionCalculatorService as any],
//   exports: [SourceTrackingService as any, CommissionCalculatorService as any]
// } as any)
// export class CommissionModule {}

import { Module, forwardRef, Provider } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { CommissionController } from './controllers/commission.controller'
import { QRCodeController } from './controllers/qr-code.controller'
import { SourceTrackingService } from './services/source-tracking.service'
import { CommissionCalculatorService } from './services/commission-calculator.service'
import { CommissionService } from './services/commission.service'
import { Commission, CommissionSchema } from './schemas/commission.schema'
import { TrackingCode, TrackingCodeSchema } from './schemas/tracking-code.schema'
import { Booking, BookingSchema } from '../booking/schemas/booking.schema'
import { Payment, PaymentSchema } from '../payment/schemas/payment.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Commission.name, schema: CommissionSchema },
      { name: TrackingCode.name, schema: TrackingCodeSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Payment.name, schema: PaymentSchema }
    ]),
  ],
  controllers: [CommissionController as any, QRCodeController as any],
  providers: [
    SourceTrackingService as any, 
    CommissionCalculatorService as any,
    CommissionService as any
  ],
  exports: [
    SourceTrackingService as any, 
    CommissionCalculatorService as any,
    CommissionService as any
  ]
} as any)
export class CommissionModule {}