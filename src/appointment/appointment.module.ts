import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from "@nestjs/mongoose"
import { AppointmentService } from "./appointment.service"
import { AppointmentController } from "./appointment.controller"
import { Appointment, AppointmentSchema } from "./schemas/appointment.schema"
import { AuditModule } from "../audit/audit.module"
import { PaymentModule } from '../payment/payment.module'
import { StaffModule } from '../staff/staff.module'
import { NotificationModule } from '../notification/notification.module'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]), 
    AuditModule,
    forwardRef(() => PaymentModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => StaffModule),
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
