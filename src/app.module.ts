import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ThrottlerModule } from "@nestjs/throttler"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from "@nestjs/core"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { AuditModule } from "./audit/audit.module"
import { SeederModule } from './database/seeders/seeder.module';
import { AuditInterceptor } from "./common/interceptors/audit.interceptor"


import { ClientModule } from "./client/client.module"
import { GiftCardModule } from "./gift-card/gift-card.module"
import { MembershipModule } from "./membership/membership.module"
import { VoucherModule } from "./voucher/voucher.module"

import { ServiceModule } from "./modules/service/service.module"
import { BookingModule } from "./modules/booking/booking.module"
import { AppointmentModule } from "./modules/appointment/appointment.module"
import { PaymentModule } from "./modules/payment/payment.module"
import { SalesModule } from "./modules/sales/sales.module"
import { TeamModule } from "./modules/team/team.module"
import { SettingsModule } from "./modules/settings/settings.module"

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
    UsersModule,
    AuditModule,
    SeederModule,

    ClientModule,
    ServiceModule,
    BookingModule,
    AppointmentModule,
    PaymentModule,
    SalesModule,
    TeamModule,
    SettingsModule,
    GiftCardModule,
    MembershipModule,
    VoucherModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
