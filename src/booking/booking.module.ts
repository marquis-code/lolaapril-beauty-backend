
// src/modules/booking/booking.module.ts
import { Module, forwardRef, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventEmitterModule } from '@nestjs/event-emitter'

// Controllers
import { BookingController } from './controllers/booking.controller'
import { BookingFlowController } from './controllers/booking-flow.controller'

// Services
import { BookingService } from './services/booking.service'
import { BookingAutomationService } from './services/booking-automation.service'
import { BookingOrchestrator } from './services/booking-orchestrator.service'

// Schemas
import { Booking, BookingSchema } from './schemas/booking.schema'

// Event Handlers
import { BookingEventHandler } from './events/booking.events'

// Middleware
import { TenantMiddleware } from '../tenant/middleware/tenant.middleware'

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
    TenantModule, // Import TenantModule to access middleware
    forwardRef(() => NotificationModule),
    forwardRef(() => AppointmentModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => StaffModule),
    forwardRef(() => ServiceModule),
  ],
  
  controllers: [BookingController, BookingFlowController],
  
  providers: [
    BookingService,
    BookingAutomationService,
    BookingOrchestrator,
    BookingEventHandler,
  ],
  
  exports: [
    BookingService,
    BookingAutomationService,
    BookingOrchestrator,
  ],
})
export class BookingModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(TenantMiddleware)
      .forRoutes(
        { path: 'bookings/*', method: RequestMethod.ALL },
        { path: 'booking-flow/*', method: RequestMethod.ALL }
      )
  }
}