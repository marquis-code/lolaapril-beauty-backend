// @ts-nocheck
import { Module, forwardRef, MiddlewareConsumer, RequestMethod } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { BookingController } from './controllers/booking.controller'
import { BookingFlowController } from './controllers/booking-flow.controller'
import { BookingService } from './services/booking.service'
import { BookingAutomationService } from './services/booking-automation.service'
import { BookingOrchestrator } from './services/booking-orchestrator.service'
import { Booking, BookingSchema } from './schemas/booking.schema'
import { BookingEventHandler } from './events/booking.events'
import { TenantMiddleware } from '../business/middleware/tenant.middleware'
import { SourceTrackingService } from './services/source-tracking.service'
import { ClientReliabilityService } from './services/client-reliability.service'
import { ClientReliability, ClientReliabilitySchema } from './schemas/client-reliability.schema'
import { AvailabilityModule } from '../availability/availability.module'
import { BusinessModule } from '../business/business.module'
import { NotificationModule } from '../notification/notification.module'
import { AppointmentModule } from '../appointment/appointment.module'
import { PaymentModule } from '../payment/payment.module'
import { StaffModule } from '../staff/staff.module'
import { ServiceModule } from '../service/service.module'
import { CommissionModule } from '../commission/commission.module'
import { CancellationModule } from '../cancellation/cancellation.module'
import { AnalyticsModule } from '../analytics/analytics.module'
import { SubscriptionModule } from '../subscription/subscription.module'
import { BusinessModule } from '../business/business.module' 

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Booking.name, schema: BookingSchema },
      { name: ClientReliability.name, schema: ClientReliabilitySchema } 
    ]),
    SubscriptionModule,
    BusinessModule,
    EventEmitterModule.forRoot(),
    forwardRef(() => AvailabilityModule),
    forwardRef(() => NotificationModule),
    forwardRef(() => AppointmentModule),
    forwardRef(() => PaymentModule),
    forwardRef(() => StaffModule),
    forwardRef(() => ServiceModule),
    forwardRef(() => CommissionModule),
    forwardRef(() => CancellationModule),
    forwardRef(() => AnalyticsModule)
  ],
  
  controllers: [
    BookingController, 
    BookingFlowController
  ],
  
  providers: [
    BookingService,
    BookingAutomationService,
    BookingOrchestrator,
    BookingEventHandler,
    SourceTrackingService,
    ClientReliabilityService
  ],
  
  exports: [
    BookingService,
    BookingAutomationService,
    BookingOrchestrator,
    SourceTrackingService,
    ClientReliabilityService
  ],
})
export class BookingModule {}