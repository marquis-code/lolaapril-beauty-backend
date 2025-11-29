
// app.module.ts
import { Module, MiddlewareConsumer, RequestMethod } from "@nestjs/common"
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from "@nestjs/mongoose"
import { ScheduleModule } from '@nestjs/schedule'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { APP_INTERCEPTOR } from "@nestjs/core"
import { WinstonModule } from 'nest-winston'
import * as winston from 'winston'

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
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
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