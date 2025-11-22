import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from "@nestjs/mongoose"
import { PaymentService } from "./payment.service"
import { ConfigModule } from '@nestjs/config'
import { PaymentController } from "./payment.controller"
import { Payment, PaymentSchema } from "./schemas/payment.schema"
import { AuditModule } from "../audit/audit.module"
import { NotificationModule } from '../notification/notification.module'

@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]), 
  ConfigModule,
  forwardRef(() => NotificationModule),
  AuditModule
],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
