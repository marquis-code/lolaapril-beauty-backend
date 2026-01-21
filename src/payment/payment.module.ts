import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from "@nestjs/mongoose"
import { PaymentService } from "./payment.service"
import { ConfigModule } from '@nestjs/config'
import { PaymentController } from "./payment.controller"
import { Payment, PaymentSchema } from "./schemas/payment.schema"
import { Booking, BookingSchema } from '../booking/schemas/booking.schema';
import { AuditModule } from "../audit/audit.module"
import { NotificationModule } from '../notification/notification.module'
import { CommissionModule } from "../commission/commission.module"
import { IntegrationModule } from "../integration/integration.module"
import { JobsModule } from "../jobs/jobs.module"
import { CacheModule } from "../cache/cache.module"
import { PricingModule } from "../pricing/pricing.module"
import { BusinessModule } from '../business/business.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema }, 
      { name: Booking.name, schema: BookingSchema }
    ]), 
    ConfigModule,
    forwardRef(() => NotificationModule),
    AuditModule,
    PricingModule,  
    CommissionModule,
    IntegrationModule,
    JobsModule, 
    CacheModule,
    BusinessModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
