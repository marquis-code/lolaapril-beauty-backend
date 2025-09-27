// src/modules/availability/availability.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AvailabilityController } from '../availability/availability.controller'
import { AvailabilityService } from '../availability/availability.service'
import { BusinessHours, BusinessHoursSchema } from './schemas/business-hours.schema'
import { StaffAvailability, StaffAvailabilitySchema } from './schemas/staff-availability.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessHours.name, schema: BusinessHoursSchema },
      { name: StaffAvailability.name, schema: StaffAvailabilitySchema },
    ]),
  ],
  controllers: [AvailabilityController],
  providers: [AvailabilityService],
  exports: [AvailabilityService],
})
export class AvailabilityModule {}