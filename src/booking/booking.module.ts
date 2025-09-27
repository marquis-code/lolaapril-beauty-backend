// import { Module } from '@nestjs/common'
// import { MongooseModule } from '@nestjs/mongoose'
// import { EventEmitterModule } from '@nestjs/event-emitter'
// import { BookingController } from './controllers/booking.controller'
// import { BookingService } from './services/booking.service'
// import { BookingAutomationService } from './services/booking-automation.service'
// import { Booking, BookingSchema } from './schemas/booking.schema'
// import { AvailabilityModule } from '../availability/availability.module'
// import { TenantModule } from '../tenant/tenant.module'
// import { NotificationModule } from '../notification/notification.module'
// import { AppointmentModule } from '../appointment/appointment.module'
// import { PaymentModule } from '../payment/payment.module'
// import { StaffModule } from '../staff/staff.module'

// @Module({
//   imports: [
//     MongooseModule.forFeature([
//       { name: Booking.name, schema: BookingSchema }
//     ]),
//     EventEmitterModule.forRoot(),
//     AvailabilityModule,
//     TenantModule,
//     NotificationModule,
//     AppointmentModule,
//     PaymentModule,
//     StaffModule,
//   ],
//   controllers: [BookingController],
//   providers: [BookingService, BookingAutomationService],
//   exports: [BookingService, BookingAutomationService],
// })
// export class BookingModule {}

import { Module, forwardRef } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventEmitterModule } from '@nestjs/event-emitter'

// Controllers
import { BookingController } from './controllers/booking.controller'

// Services
import { BookingService } from './services/booking.service'
import { BookingAutomationService } from './services/booking-automation.service'
import { BookingOrchestrator } from './services/booking-orchestrator.service'

// Schemas
import { Booking, BookingSchema } from './schemas/booking.schema'

// Event Handlers
import { BookingEventHandler } from './events/booking.events'

// Import other modules (using forwardRef to avoid circular dependencies)
import { AvailabilityModule } from '../availability/availability.module'
import { TenantModule } from '../tenant/tenant.module'
import { NotificationModule } from '../notification/notification.module'
import { AppointmentModule } from '../appointment/appointment.module'
import { PaymentModule } from '../payment/payment.module'
import { StaffModule } from '../staff/staff.module'
import { ServiceModule } from '../service/service.module'

@Module({
  imports: [
    // Database
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema }
    ]),
    
    // Event system
    EventEmitterModule.forRoot(),
    
    // Related modules (using forwardRef to prevent circular dependencies)
    forwardRef(() => AvailabilityModule),
    forwardRef(() => TenantModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => AppointmentModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => StaffModule),
    forwardRef(() => ServiceModule),
  ],
  
  controllers: [BookingController],
  
  providers: [
    BookingService,
    BookingAutomationService,
    BookingOrchestrator, // Main orchestrator service
    BookingEventHandler, // Event handler for automated workflows
  ],
  
  exports: [
    BookingService,
    BookingAutomationService,
    BookingOrchestrator, // Export so other modules can use it
  ],
})
export class BookingModule {}