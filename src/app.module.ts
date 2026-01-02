// app.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from "@nestjs/mongoose"
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { APP_INTERCEPTOR } from "@nestjs/core"
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { ThrottlerModule } from '@nestjs/throttler'
import { RedisModule } from '@nestjs-modules/ioredis'

import { ClientModule } from "./client/client.module"
import { ServiceModule } from "./service/service.module"
import { AppointmentModule } from "./appointment/appointment.module"
import { BookingModule } from "./booking/booking.module"
import { PaymentModule } from "./payment/payment.module"
import { SalesModule } from "./sales/sales.module"
import { TeamModule } from "./team/team.module"
import { SettingsModule } from "./settings/settings.module"
import { VoucherModule } from "./voucher/voucher.module"
import { MembershipModule } from "./membership/membership.module"
import { ReportsModule } from "./reports/reports.module"
import { AuthModule } from "./auth/auth.module"
import { CommissionModule } from "./commission/commission.module"
import { AuditModule } from "./audit/audit.module"
import { CancellationModule } from "./cancellation/cancellation.module"
import { UploadModule } from "./upload/upload.module"
import { AvailabilityModule } from './availability/availability.module'
import { NotificationModule } from './notification/notification.module'
import { TenantModule } from './tenant/tenant.module'
import { StaffModule } from './staff/staff.module'
import { AuditInterceptor } from './audit/interceptors/audit.interceptor'
import { TenantMiddleware } from './tenant/middleware/tenant.middleware'
import { SubdomainRedirectMiddleware } from './tenant/middleware/subdomain-redirect.middleware'
import { AnalyticsModule } from './analytics/analytics.module'
import { PricingModule } from './pricing/pricing.module';
import { BrandingModule } from './branding/branding.module';
import { SupportModule } from './support/support.module';
import { IntegrationModule } from './integration/integration.module';
import { JobsModule } from './jobs/jobs.module';
import { CacheModule } from './cache/cache.module';
import { MonitoringModule } from './monitoring/monitoring.module';
import { WebhookModule } from './webhook/webhook.module';
import { RateLimiterModule } from './rate-limiter/rate-limiter.module';
import { MarketplaceModule } from './marketplace/marketplace.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    // Redis Configuration - FIXED
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const redisHost = configService.get<string>('REDIS_HOST');
        const redisPort = configService.get<number>('REDIS_PORT');
        const redisPassword = configService.get<string>('REDIS_PASSWORD');
        const redisUsername = configService.get<string>('REDIS_USERNAME');
        const redisTls = configService.get<string>('REDIS_TLS');

        console.log('🔴 Redis Configuration:');
        console.log(`   Host: ${redisHost}`);
        console.log(`   Port: ${redisPort}`);
        console.log(`   Username: ${redisUsername}`);
        console.log(`   Password: ${redisPassword ? '***' : 'not set'}`);
        console.log(`   REDIS_TLS env: ${redisTls}`);
        console.log(`   TLS: ${redisTls === 'true' ? 'enabled' : 'disabled'}`);

        // Build config object
        const config: any = {
          type: 'single',
          options: {
            host: redisHost,
            port: redisPort,
            password: redisPassword,
            username: redisUsername,
            retryStrategy: (times: number) => {
              const delay = Math.min(times * 50, 2000);
              return delay;
            },
            maxRetriesPerRequest: 3,
            enableReadyCheck: true,
            lazyConnect: false,
          },
        };

        // ✅ ONLY add TLS if explicitly set to 'true'
        if (redisTls === 'true') {
          config.options.tls = {
            rejectUnauthorized: false
          };
          console.log('   ✅ TLS Config Added');
        } else {
          console.log('   ✅ TLS Disabled (not added to config)');
        }

        return config;
      },
    }),

    // Winston Logger - Global setup
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.ms(),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.colorize(),
            winston.format.printf(({ level, message, timestamp, ms, ...meta }) => {
              let log = `${timestamp} [${level}]: ${message}`
              if (Object.keys(meta).length > 0) {
                log += ` ${JSON.stringify(meta, null, 2)}`
              }
              if (ms) log += ` (${ms})`
              return log
            }),
          ),
        }),
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
    }),

    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully')
            console.log(`📍 Database: ${connection.name}`)
            console.log(`🔗 Host: ${connection.host}:${connection.port}`)
          })
          
          connection.on('error', (error: any) => {
            console.error('❌ MongoDB connection error:', error.message)
          })
          
          connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected')
          })
          
          return connection
        },
      }),
    }),

    // Throttling (alternative to custom rate limiter)
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 100, // 100 requests per minute
      },
    ]),

    MonitoringModule,
    CacheModule,
    RateLimiterModule,

    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    
    // Feature Modules
    TenantModule,
    AuthModule,
    AuditModule,
    UploadModule,
    ClientModule,
    ServiceModule,
    AppointmentModule,
    BookingModule,
    PaymentModule,
    SalesModule,
    TeamModule,
    SettingsModule,
    VoucherModule,
    MembershipModule,
    ReportsModule,
    AvailabilityModule,
    NotificationModule,
    StaffModule,
    CommissionModule,
    CancellationModule,
    AnalyticsModule,

    // Enhanced modules
    CancellationModule,
    CommissionModule,

    // New critical modules
    PricingModule,
    BrandingModule,
    SupportModule,
    MarketplaceModule,

    // Integration & background processing
    IntegrationModule,
    JobsModule,
    WebhookModule,
  ],

  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    }
  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
  }
}