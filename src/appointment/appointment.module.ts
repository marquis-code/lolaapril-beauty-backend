import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { AppointmentService } from "./appointment.service"
import { AppointmentController } from "./appointment.controller"
import { Appointment, AppointmentSchema } from "./schemas/appointment.schema"
import { AuditModule } from "../audit/audit.module"

@Module({
  imports: [MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]), AuditModule],
  controllers: [AppointmentController],
  providers: [AppointmentService],
  exports: [AppointmentService],
})
export class AppointmentModule {}
