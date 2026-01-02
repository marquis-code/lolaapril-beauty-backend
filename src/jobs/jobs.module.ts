// jobs/jobs.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { JobsService } from './jobs.service';
import { PayoutProcessor } from './processors/payout.processor';
import { ReportGenerationProcessor } from './processors/report-generation.processor';

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
  ],
  exports: [JobsService, BullModule],
})
export class JobsModule {}