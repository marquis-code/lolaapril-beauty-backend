import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ScheduleModule } from '@nestjs/schedule'
import { NotificationService } from './notification.service'
import { NotificationController } from './notification.controller'
import { EmailService } from './email.service'
import { SMSService } from './sms.service'
import {
  NotificationTemplate,
  NotificationTemplateSchema,
  NotificationLog,
  NotificationLogSchema,
  NotificationPreference,
  NotificationPreferenceSchema
} from '../notification/schemas/notification.schema'

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
    ]),
    ScheduleModule.forRoot(), // For cron jobs - make sure this is only imported once in your app
  ],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    EmailService,
    SMSService,
  ],
  exports: [
    NotificationService,
    EmailService,
    SMSService,
  ],
})
export class NotificationModule {}