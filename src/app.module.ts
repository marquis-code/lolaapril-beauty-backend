import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { ThrottlerModule } from "@nestjs/throttler"
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from "@nestjs/core"
import { AuthModule } from "./auth/auth.module"
import { UsersModule } from "./users/users.module"
import { EnquiriesModule } from "./enquiries/enquiries.module"
import { SubscriptionsModule } from "./subscriptions/subscriptions.module"
import { TeamsModule } from "./teams/teams.module"
import { PublicationsModule } from "./publications/publications.module"
import { ProgramsModule } from "./programs/programs.module"
import { BlogsModule } from "./blogs/blogs.module"
import { FormsModule } from "./forms/forms.module"
import { AuditModule } from "./audit/audit.module"
import { AuditInterceptor } from "./common/interceptors/audit.interceptor"

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
    EnquiriesModule,
    SubscriptionsModule,
    TeamsModule,
    PublicationsModule,
    ProgramsModule,
    BlogsModule,
    FormsModule,
    AuditModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule {}
