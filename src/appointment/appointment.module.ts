import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from "@nestjs/mongoose"
import { AppointmentService } from "./appointment.service"
import { AppointmentController } from "./appointment.controller"
import { Appointment, AppointmentSchema } from "./schemas/appointment.schema"
import { AuditModule } from "../audit/audit.module"
import { PaymentModule } from '../payment/payment.module'
import { StaffModule } from '../staff/staff.module'
import { NotificationModule } from '../notification/notification.module'
import { SalesModule } from '../sales/sales.module'
import { IntegrationModule } from '../integration/integration.module'
import { ScheduledReminder, ScheduledReminderSchema } from '../jobs/schemas/scheduled-reminder.schema'
import { ClientModule } from '../client/client.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Appointment.name, schema: AppointmentSchema },
      { name: ScheduledReminder.name, schema: ScheduledReminderSchema },
    ]),
    AuditModule,
    forwardRef(() => PaymentModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => StaffModule),
    forwardRef(() => SalesModule),
    IntegrationModule,
    ClientModule,
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule { }
