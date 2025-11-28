/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Model } from 'mongoose';
import { NotificationService } from './notification.service';
import { NotificationTemplate, NotificationTemplateDocument, NotificationLog, NotificationLogDocument, NotificationPreference, NotificationPreferenceDocument } from './schemas/notification.schema';
export declare class NotificationController {
    private readonly notificationService;
    private notificationTemplateModel;
    private notificationLogModel;
    private notificationPreferenceModel;
    constructor(notificationService: NotificationService, notificationTemplateModel: Model<NotificationTemplateDocument>, notificationLogModel: Model<NotificationLogDocument>, notificationPreferenceModel: Model<NotificationPreferenceDocument>);
    getTemplates(businessId: string): Promise<(import("mongoose").Document<unknown, {}, NotificationTemplateDocument, {}, {}> & NotificationTemplate & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getNotificationLogs(businessId: string, limit?: number, offset?: number): Promise<(import("mongoose").Document<unknown, {}, NotificationLogDocument, {}, {}> & NotificationLog & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    updateNotificationPreferences(updateDto: {
        userId: string;
        businessId: string;
        preferences: any;
    }): Promise<import("mongoose").Document<unknown, {}, NotificationPreferenceDocument, {}, {}> & NotificationPreference & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    getNotificationPreferences(userId: string, businessId: string): Promise<(import("mongoose").Document<unknown, {}, NotificationPreferenceDocument, {}, {}> & NotificationPreference & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }) | {
        preferences: {
            booking_confirmation: {
                email: true;
                sms: true;
            };
            booking_rejection: {
                email: true;
                sms: true;
            };
            appointment_reminder: {
                email: true;
                sms: true;
            };
            appointment_cancelled: {
                email: true;
                sms: true;
            };
            payment_confirmation: {
                email: true;
                sms: false;
            };
            payment_failed: {
                email: true;
                sms: true;
            };
            promotional: {
                email: false;
                sms: false;
            };
        };
    }>;
    sendCustomNotification(customDto: {
        businessId: string;
        recipientId: string;
        recipientType: 'client' | 'staff' | 'admin';
        recipient: string;
        recipientPhone?: string;
        subject: string;
        content: string;
        channel: 'email' | 'sms' | 'both';
    }): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
    } | {
        success: boolean;
        error: any;
        message?: undefined;
    }>;
    createTemplate(templateDto: {
        businessId: string;
        templateName: string;
        templateType: string;
        channel: string;
        subject: string;
        content: string;
        availableVariables?: any[];
        createdBy: string;
    }): Promise<import("mongoose").Document<unknown, {}, NotificationTemplateDocument, {}, {}> & NotificationTemplate & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    updateTemplate(templateId: string, updateDto: {
        templateName?: string;
        channel?: string;
        subject?: string;
        content?: string;
        isActive?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, NotificationTemplateDocument, {}, {}> & NotificationTemplate & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    seedTemplates(): Promise<{
        success: boolean;
        message: string;
    }>;
}
