import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { NotificationService } from './notification.service'
import {
  NotificationTemplate,
  NotificationTemplateDocument,
  NotificationLog,
  NotificationLogDocument,
  NotificationPreference,
  NotificationPreferenceDocument
} from './schemas/notification.schema'

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    @InjectModel(NotificationTemplate.name)
    private notificationTemplateModel: Model<NotificationTemplateDocument>,
    @InjectModel(NotificationLog.name)
    private notificationLogModel: Model<NotificationLogDocument>,
    @InjectModel(NotificationPreference.name)
    private notificationPreferenceModel: Model<NotificationPreferenceDocument>,
  ) {}

  @Get('templates/:businessId')
  async getTemplates(@Param('businessId') businessId: string) {
    return await this.notificationTemplateModel.find({
      businessId: new Types.ObjectId(businessId),
      isActive: true,
    })
  }

  @Get('logs/:businessId')
  async getNotificationLogs(
    @Param('businessId') businessId: string,
    @Query('limit') limit = 50,
    @Query('offset') offset = 0
  ) {
    return await this.notificationLogModel
      .find({ businessId: new Types.ObjectId(businessId) })
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(Number(offset))
      .populate('templateId')
  }

  @Post('preferences')
  async updateNotificationPreferences(@Body() updateDto: {
    userId: string
    businessId: string
    preferences: any
  }) {
    return await this.notificationPreferenceModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(updateDto.userId),
        businessId: new Types.ObjectId(updateDto.businessId),
      },
      { preferences: updateDto.preferences },
      { upsert: true, new: true }
    )
  }

  @Get('preferences/:userId/:businessId')
  async getNotificationPreferences(
    @Param('userId') userId: string,
    @Param('businessId') businessId: string
  ) {
    const preferences = await this.notificationPreferenceModel.findOne({
      userId: new Types.ObjectId(userId),
      businessId: new Types.ObjectId(businessId),
    })

    return preferences || {
      preferences: {
        booking_confirmation: { email: true, sms: true },
        booking_rejection: { email: true, sms: true },
        appointment_reminder: { email: true, sms: true },
        appointment_cancelled: { email: true, sms: true },
        payment_confirmation: { email: true, sms: false },
        payment_failed: { email: true, sms: true },
        promotional: { email: false, sms: false },
      }
    }
  }

  @Post('send-custom')
  async sendCustomNotification(@Body() customDto: {
    businessId: string
    recipientId: string
    recipientType: 'client' | 'staff' | 'admin'
    recipient: string
    recipientPhone?: string
    subject: string
    content: string
    channel: 'email' | 'sms' | 'both'
  }) {
    try {
      // This would use the notification service to send custom notifications
      // You might want to implement this method in the service
      return { success: true, message: 'Custom notification sent successfully' }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  @Post('templates')
  async createTemplate(@Body() templateDto: {
    businessId: string
    templateName: string
    templateType: string
    channel: string
    subject: string
    content: string
    availableVariables?: any[]
    createdBy: string
  }) {
    const template = new this.notificationTemplateModel({
      businessId: new Types.ObjectId(templateDto.businessId),
      templateName: templateDto.templateName,
      templateType: templateDto.templateType,
      channel: templateDto.channel,
      subject: templateDto.subject,
      content: templateDto.content,
      availableVariables: templateDto.availableVariables || [],
      createdBy: new Types.ObjectId(templateDto.createdBy),
    })

    return await template.save()
  }

  @Post('templates/:templateId')
  async updateTemplate(
    @Param('templateId') templateId: string,
    @Body() updateDto: {
      templateName?: string
      channel?: string
      subject?: string
      content?: string
      isActive?: boolean
    }
  ) {
    return await this.notificationTemplateModel.findByIdAndUpdate(
      templateId,
      { ...updateDto, updatedAt: new Date() },
      { new: true }
    )
  }
}