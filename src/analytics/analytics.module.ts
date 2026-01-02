

// // src/modules/analytics/analytics.module.ts
// import { Module } from '@nestjs/common';
// import { MongooseModule } from '@nestjs/mongoose';
// import { AnalyticsController } from './analytics.controller';
// import { AnalyticsService } from './analytics.service';
// import {
//   FinancialReport,
//   FinancialReportSchema,
// } from './schemas/financial-report.schema';
// import { Booking, BookingSchema } from '../booking/schemas/booking.schema';
// import { Payment, PaymentSchema } from '../payment/schemas/payment.schema';
// import {
//   Commission,
//   CommissionSchema,
// } from '../commission/schemas/commission.schema';

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: FinancialReport.name, schema: FinancialReportSchema },
//       { name: Booking.name, schema: BookingSchema },
//       { name: Payment.name, schema: PaymentSchema },
//       { name: Commission.name, schema: CommissionSchema },
//     ]),
//   ],
//   controllers: [AnalyticsController],
//   providers: [AnalyticsService],
//   exports: [AnalyticsService],
// })
// export class AnalyticsModule {}

// src/modules/analytics/analytics.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import {
  FinancialReport,
  FinancialReportSchema,
} from './schemas/financial-report.schema';
import { Booking, BookingSchema } from '../booking/schemas/booking.schema';
import { Payment, PaymentSchema } from '../payment/schemas/payment.schema';
import {
  Commission,
  CommissionSchema,
} from '../commission/schemas/commission.schema';
import { AuditModule } from '../audit/audit.module'; // Import AuditModule

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: FinancialReport.name, schema: FinancialReportSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Commission.name, schema: CommissionSchema },
    ]),
    AuditModule, // Add AuditModule to imports
  ],
  controllers: [AnalyticsController],
  providers: [AnalyticsService],
  exports: [AnalyticsService],
})
export class AnalyticsModule {}