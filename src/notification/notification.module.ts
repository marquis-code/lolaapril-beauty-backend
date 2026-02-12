import { Module, Global } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { JwtModule } from '@nestjs/jwt'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { EmailService } from './email.service'
import { SMSService } from './sms.service'
import { EmailTemplatesService } from './templates/email-templates.service'
import { ChatService } from './services/chat.service'
import { ChatSeederService } from './services/chat-seeder.service'
import { NotificationEventListener } from './services/notification-event.listener'
import { RealtimeGateway } from './gateways/realtime.gateway'
import { ChatController } from './controllers/chat.controller'
import {
  NotificationTemplate,
  NotificationTemplateSchema,
  NotificationLog,
  NotificationLogSchema,
  NotificationPreference,
  NotificationPreferenceSchema
} from '../notification/schemas/notification.schema'
import {
  ChatRoom,
  ChatRoomSchema,
  ChatMessage,
  ChatMessageSchema,
  ChatParticipant,
  ChatParticipantSchema,
  FAQ,
  FAQSchema,
  AutoResponse,
  AutoResponseSchema,
} from './schemas/chat.schema'
import { BusinessModule } from '../business/business.module'
import { User, UserSchema } from '../auth/schemas/user.schema'
import { SalesModule } from '../sales/sales.module'

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: NotificationTemplate.name,
        schema: NotificationTemplateSchema,
      },
      {
        name: NotificationLog.name,
        schema: NotificationLogSchema,
      },
      {
        name: NotificationPreference.name,
        schema: NotificationPreferenceSchema,
      },
      {
        name: ChatRoom.name,
        schema: ChatRoomSchema,
      },
      {
        name: ChatMessage.name,
        schema: ChatMessageSchema,
      },
      {
        name: ChatParticipant.name,
        schema: ChatParticipantSchema,
      },
      {
        name: FAQ.name,
        schema: FAQSchema,
      },
      {
        name: AutoResponse.name,
        schema: AutoResponseSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    ScheduleModule.forRoot(),
    BusinessModule,
    SalesModule,
  ],
  controllers: [NotificationController, ChatController],
  // @ts-ignore - TS2590: Complex union type fix
  providers: [
    NotificationService,
    EmailService,
    SMSService,
    EmailTemplatesService,
    ChatService,
    ChatSeederService,
    NotificationEventListener,
    RealtimeGateway,
  ],
  // @ts-ignore - TS2590: Complex union type fix
  exports: [
    NotificationService,
    EmailService,
    SMSService,
    EmailTemplatesService,
    ChatService,
    ChatSeederService,
    RealtimeGateway,
  ],
})
export class NotificationModule { }