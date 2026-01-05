// // src/modules/availability/availability.module.ts
// import { Module } from '@nestjs/common'
// import { MongooseModule } from '@nestjs/mongoose'
// import { AvailabilityController } from '../availability/availability.controller'
// import { AvailabilityService } from '../availability/availability.service'
// import { BusinessHours, BusinessHoursSchema } from './schemas/business-hours.schema'
// import { StaffAvailability, StaffAvailabilitySchema } from './schemas/staff-availability.schema'

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: BusinessHours.name, schema: BusinessHoursSchema },
//       { name: StaffAvailability.name, schema: StaffAvailabilitySchema },
//     ]),
//   ],
//   controllers: [AvailabilityController],
//   providers: [AvailabilityService],
//   exports: [AvailabilityService],
// })
// export class AvailabilityModule {}

// src/modules/availability/availability.module.ts
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'

import { AvailabilityController } from './availability.controller'
import { AvailabilityService } from './availability.service'
import { AvailabilitySchedulerService } from './availability-scheduler.service'

import { BusinessHours, BusinessHoursSchema } from './schemas/business-hours.schema'
import { StaffAvailability, StaffAvailabilitySchema } from './schemas/staff-availability.schema'

// Import from Auth module for guards and decorators
import { AuthModule } from '../auth/auth.module'
// Import from Tenant module for business management
import { BusinessModule } from '../business/business.module'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BusinessHours.name, schema: BusinessHoursSchema },
      { name: StaffAvailability.name, schema: StaffAvailabilitySchema },
    ]),
    ScheduleModule.forRoot(), // For cron jobs
    AuthModule,  // Provides JWT guards and decorators
    BusinessModule, // Provides business validation
  ],
  controllers: [AvailabilityController],
  providers: [
    AvailabilityService,
    AvailabilitySchedulerService,
  ],
  exports: [
    AvailabilityService,
    MongooseModule, // Export schemas for other modules
  ],
})
export class AvailabilityModule {}