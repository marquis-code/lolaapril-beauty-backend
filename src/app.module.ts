// ============================================================================
// FILE 6: src/app.module.ts (UPDATE - ADD GLOBAL GUARDS)
// ============================================================================
import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from "@nestjs/mongoose"
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { APP_INTERCEPTOR, APP_GUARD } from "@nestjs/core"
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler'
import { RedisModule } from '@nestjs-modules/ioredis'

// Import Global Guards
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard"
import { ValidateBusinessAccessGuard } from "./auth/guards/validate-business-access.guard"

// Import Modules
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
import { BusinessModule } from './business/business.module'
import { StaffModule } from './staff/staff.module'
import { AuditInterceptor } from './audit/interceptors/audit.interceptor'
import { AnalyticsModule } from './analytics/analytics.module'
import { PricingModule } from './pricing/pricing.module'
import { BrandingModule } from './branding/branding.module'
import { SupportModule } from './support/support.module'
import { IntegrationModule } from './integration/integration.module'
import { JobsModule } from './jobs/jobs.module'
import { CacheModule } from './cache/cache.module'
import { MonitoringModule } from './monitoring/monitoring.module'
import { WebhookModule } from './webhook/webhook.module'
import { RateLimiterModule } from './rate-limiter/rate-limiter.module'
import { MarketplaceModule } from './marketplace/marketplace.module'
import { SubscriptionModule } from './subscription/subscription.module'  

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),

    // Redis Configuration
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
        console.log(`   TLS: ${redisTls === 'true' ? 'enabled' : 'disabled'}`);

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

        if (redisTls === 'true') {
          config.options.tls = {
            rejectUnauthorized: false
          };
        }

        return config;
      },
    }),

    // Winston Logger
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
          maxsize: 5242880,
          maxFiles: 5,
        }),
        new winston.transports.File({
          filename: 'logs/combined.log',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json(),
          ),
          maxsize: 5242880,
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

    // Throttling
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),

    MonitoringModule,
    CacheModule,
    RateLimiterModule,

    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    
    // ⚠️ IMPORTANT: AuthModule MUST be imported before using guards
    AuthModule,
    
    // Feature Modules
    BusinessModule,
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
    PricingModule,
    BrandingModule,
    SupportModule,
    MarketplaceModule,
    IntegrationModule,
    JobsModule,
    WebhookModule,
    SubscriptionModule
  ],

  providers: [
    // Audit Interceptor
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
    
    // 🔥 GLOBAL GUARDS - Applied to ALL routes by default
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // ✅ Authentication on all routes (opt-out with @Public())
    },
    {
      provide: APP_GUARD,
      useClass: ValidateBusinessAccessGuard, // ✅ Business validation (opt-in with @ValidateBusiness())
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Your existing middleware configuration
  }
}
