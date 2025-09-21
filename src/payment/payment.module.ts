import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { PaymentService } from "./payment.service"
import { PaymentController } from "./payment.controller"
import { Payment, PaymentSchema } from "./schemas/payment.schema"
import { AuditModule } from "../audit/audit.module"

@Module({
  imports: [MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]), AuditModule],
  controllers: [PaymentController],
  providers: [PaymentService],
  exports: [PaymentService],
})
export class PaymentModule {}
