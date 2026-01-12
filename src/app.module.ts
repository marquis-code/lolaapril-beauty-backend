// ============================================================================
// FILE: src/app.module.ts (UPDATED - COMPREHENSIVE LOGGING)
// ============================================================================
import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from "@nestjs/mongoose"
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { APP_INTERCEPTOR, APP_GUARD, APP_FILTER } from "@nestjs/core"
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

    // Redis Configuration with Enhanced Logging
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
              console.log(`🔄 Redis retry attempt ${times}, waiting ${delay}ms`);
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

    // Winston Logger - Enhanced Configuration
    WinstonModule.forRoot({
      transports: [
        // Console Transport - Detailed colored output
        new winston.transports.Console({
          level: 'debug', // Log everything to console
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.ms(),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.colorize({ all: true }),
            winston.format.printf(({ level, message, timestamp, ms, context, stack, ...meta }) => {
              let log = `${timestamp} [${context || 'Application'}] ${level}: ${message}`;
              
              // Add execution time if available
              if (ms) log += ` ${ms}`;
              
              // Add metadata if present
              if (Object.keys(meta).length > 0) {
                log += `\n   📋 Meta: ${JSON.stringify(meta, null, 2)}`;
              }
              
              // Add stack trace for errors
              if (stack) {
                log += `\n   🔥 Stack: ${stack}`;
              }
              
              return log;
            }),
          ),
        }),

        // Error Log File - Only errors
        new winston.transports.File({
          filename: 'logs/error.log',
          level: 'error',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 10,
        }),

        // Combined Log File - All logs
        new winston.transports.File({
          filename: 'logs/combined.log',
          level: 'debug',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 10,
        }),

        // HTTP Requests Log File
        new winston.transports.File({
          filename: 'logs/http.log',
          level: 'http',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),

        // Database Operations Log File
        new winston.transports.File({
          filename: 'logs/database.log',
          level: 'debug',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),

        // Authentication Log File
        new winston.transports.File({
          filename: 'logs/auth.log',
          level: 'info',
          format: winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.json(),
          ),
          maxsize: 5242880, // 5MB
          maxFiles: 5,
        }),
      ],
      // Set default metadata
      defaultMeta: { 
        service: 'lola-beauty-backend',
        environment: process.env.NODE_ENV || 'development'
      },
    }),

    // MongoDB Configuration with Enhanced Logging
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        // Enable Mongoose debugging
        connectionFactory: (connection) => {
          // Set mongoose debug mode
          connection.set('debug', (collectionName: string, method: string, query: any, doc: any) => {
            console.log(`📊 MongoDB Query: ${collectionName}.${method}`, {
              query: JSON.stringify(query),
              doc: doc ? JSON.stringify(doc) : undefined,
              timestamp: new Date().toISOString()
            });
          });

          connection.on('connected', () => {
            console.log('✅ MongoDB connected successfully');
            console.log(`📍 Database: ${connection.name}`);
            console.log(`🔗 Host: ${connection.host}:${connection.port}`);
            console.log(`⏰ Connected at: ${new Date().toISOString()}`);
          });
          
          connection.on('error', (error: any) => {
            console.error('❌ MongoDB connection error:', {
              message: error.message,
              code: error.code,
              name: error.name,
              timestamp: new Date().toISOString()
            });
          });
          
          connection.on('disconnected', () => {
            console.log('⚠️  MongoDB disconnected at:', new Date().toISOString());
          });

          connection.on('reconnected', () => {
            console.log('🔄 MongoDB reconnected at:', new Date().toISOString());
          });

          connection.on('close', () => {
            console.log('🔴 MongoDB connection closed at:', new Date().toISOString());
          });
          
          return connection;
        },
      }),
    }),

    // Throttling with Logging
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
  constructor() {
    // Log application startup
    console.log('🚀 Application Module Initialized');
    console.log(`📅 Startup Time: ${new Date().toISOString()}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📍 Node Version: ${process.version}`);
    console.log('═'.repeat(80));
  }

  configure(consumer: MiddlewareConsumer) {
    // Your existing middleware configuration
    console.log('⚙️  Configuring middleware...');
  }
}