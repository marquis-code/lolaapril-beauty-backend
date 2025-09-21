import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ThrottlerModule } from "@nestjs/throttler"
import { ConfigModule, ConfigService } from '@nestjs/config';
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
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 10,
      },
    ]),
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
  ],
  providers: [],
})
export class AppModule {}
