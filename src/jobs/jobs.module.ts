// jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JobsService } from './jobs.service';
import { PayoutProcessor } from './processors/payout.processor';
import { ReportGenerationProcessor } from './processors/report-generation.processor';
import { BookingCronService } from './booking-cron.service';
import { PostCompletionCronService } from './post-completion-cron.service';
import { BusinessReminderCronService } from './business-reminder-cron.service';
import { ScheduledReminder, ScheduledReminderSchema } from './schemas/scheduled-reminder.schema';
import { Appointment, AppointmentSchema } from '../appointment/schemas/appointment.schema';
import { EmailTemplatesService } from '../notification/templates/email-templates.service';

import { Payment, PaymentSchema } from '../payment/schemas/payment.schema';
import { Booking, BookingSchema } from '../booking/schemas/booking.schema';

import { NotificationModule } from '../notification/notification.module';
import { CacheModule } from '../cache/cache.module';
import { CommissionModule } from '../commission/commission.module';
import { IntegrationModule } from '../integration/integration.module';

@Module({
  imports: [
    ConfigModule,

    // Register Bull queues
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
        },
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 1000,
          },
          removeOnComplete: 100,
          removeOnFail: 200,
        },
      }),
      inject: [ConfigService],
    }),

    // Register individual queues
    BullModule.registerQueue(
      { name: 'payouts' },
      { name: 'reports' },
      { name: 'notifications' },
      { name: 'analytics' },
    ),

    // Mongoose schemas
    MongooseModule.forFeature([
      { name: Payment.name, schema: PaymentSchema },
      { name: Booking.name, schema: BookingSchema },
      { name: ScheduledReminder.name, schema: ScheduledReminderSchema },
      { name: Appointment.name, schema: AppointmentSchema },
    ]),

    // Other modules
    NotificationModule,
    CacheModule,
    CommissionModule,
    IntegrationModule,
  ],
  providers: [
    JobsService,
    PayoutProcessor,
    ReportGenerationProcessor,
    BookingCronService,
    PostCompletionCronService,
    BusinessReminderCronService,
    EmailTemplatesService,
  ],
  exports: [JobsService, BullModule],
})
export class JobsModule { }