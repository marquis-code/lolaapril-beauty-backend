import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ThrottlerModule } from "@nestjs/throttler"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { APP_INTERCEPTOR } from "@nestjs/core"
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
import { AuditModule } from "./audit/audit.module"
import { UploadModule } from "./upload/upload.module"
import { AvailabilityModule } from './availability/availability.module'
import { NotificationModule } from './notification/notification.module'
import { TenantModule } from './tenant/tenant.module'
import { StaffModule } from './staff/staff.module'
import { AuditInterceptor } from './audit/interceptors/audit.interceptor'

import { TenantMiddleware } from './tenant/middleware/tenant.middleware'
import { SubdomainRedirectMiddleware } from './tenant/middleware/subdomain-redirect.middleware'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV || 'development'}`],
    }),
       // Database
       MongooseModule.forRootAsync({
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: async (configService: ConfigService) => ({
          uri: configService.get<string>('MONGO_URL'),
          useNewUrlParser: true,
          useUnifiedTopology: true,
        }),
      }),

          // Scheduling for automated tasks
    ScheduleModule.forRoot(),

    // Event emitter for decoupled communication
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      newListener: false,
      removeListener: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),

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
    // Apply subdomain redirect middleware first
    consumer
      .apply(SubdomainRedirectMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })

    // Apply tenant middleware to all routes except health check
    consumer
      .apply(TenantMiddleware)
      .exclude(
        { path: 'health', method: RequestMethod.GET },
        { path: 'docs', method: RequestMethod.GET },
        { path: 'api/auth/login', method: RequestMethod.POST },
        { path: 'api/auth/register', method: RequestMethod.POST },
        { path: 'api/webhooks/(.*)', method: RequestMethod.ALL },
        { path: 'api/tenant', method: RequestMethod.POST },
        { path: 'api/tenant/register', method: RequestMethod.POST },
        { path: 'api/tenant/check-subdomain', method: RequestMethod.GET },
        'api/auth/(.*)',
      )
      .forRoutes({ path: '*', method: RequestMethod.ALL })
  }
}

