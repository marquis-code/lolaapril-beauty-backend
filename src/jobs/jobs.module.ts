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

    // Register Bull queues with Shared connection logic
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const redisOptions = {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          maxRetriesPerRequest: null,
          enableReadyCheck: false,
        };

        // Shared connections map to prevent duplicate initializations within this module
        const sharedConnections = new Map<string, any>();

        return {
          // Bull (v4) uses ioredis internally. We provide a custom createClient
          createClient: (type: string) => {
            switch (type) {
              case 'client':
                if (!sharedConnections.has('client')) {
                  const Redis = require('ioredis');
                  sharedConnections.set('client', new Redis(redisOptions));
                }
                return sharedConnections.get('client');
              case 'subscriber':
                if (!sharedConnections.has('subscriber')) {
                  const Redis = require('ioredis');
                  sharedConnections.set('subscriber', new Redis(redisOptions));
                }
                return sharedConnections.get('subscriber');
              case 'bclient':
                // bclient (blocking client) should NOT be shared if multiple queues 
                // perform blocking operations simultaneously, but Bull usually 
                // manages this. For maximum connection savings, we return a new one 
                // or a managed one. 
                const Redis = require('ioredis');
                return new Redis(redisOptions);
              default:
                const DefaultRedis = require('ioredis');
                return new DefaultRedis(redisOptions);
            }
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
        };
      },
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