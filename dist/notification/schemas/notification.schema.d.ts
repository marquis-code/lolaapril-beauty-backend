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
import { Document, Types } from 'mongoose';
export type NotificationTemplateDocument = NotificationTemplate & Document;
export type NotificationLogDocument = NotificationLog & Document;
export type NotificationPreferenceDocument = NotificationPreference & Document;
export declare class TemplateVariable {
    key: string;
    description: string;
    example: string;
}
export declare class NotificationTemplate {
    businessId: Types.ObjectId;
    templateName: string;
    templateType: string;
    channel: string;
    subject: string;
    content: string;
    availableVariables: TemplateVariable[];
    isActive: boolean;
    isDefault: boolean;
    createdBy: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare class NotificationLog {
    businessId: Types.ObjectId;
    recipientId: Types.ObjectId;
    recipientType: string;
    channel: string;
    recipient: string;
    subject: string;
    content: string;
    status: string;
    providerMessageId: string;
    errorMessage: string;
    sentAt: Date;
    deliveredAt: Date;
    relatedEntityId: Types.ObjectId;
    relatedEntityType: string;
    templateId: Types.ObjectId;
    isRead: boolean;
    readAt: Date;
    createdAt: Date;
}
export declare class NotificationPreference {
    userId: Types.ObjectId;
    businessId: Types.ObjectId;
    preferences: {
        booking_confirmation: {
            email: boolean;
            sms: boolean;
        };
        booking_rejection: {
            email: boolean;
            sms: boolean;
        };
        appointment_reminder: {
            email: boolean;
            sms: boolean;
        };
        appointment_cancelled: {
            email: boolean;
            sms: boolean;
        };
        appointment_completed: {
            email: boolean;
            sms: boolean;
        };
        payment_confirmation: {
            email: boolean;
            sms: boolean;
        };
        payment_failed: {
            email: boolean;
            sms: boolean;
        };
        promotional: {
            email: boolean;
            sms: boolean;
        };
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const NotificationTemplateSchema: import("mongoose").Schema<NotificationTemplate, import("mongoose").Model<NotificationTemplate, any, any, any, Document<unknown, any, NotificationTemplate, any, {}> & NotificationTemplate & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NotificationTemplate, Document<unknown, {}, import("mongoose").FlatRecord<NotificationTemplate>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<NotificationTemplate> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const NotificationLogSchema: import("mongoose").Schema<NotificationLog, import("mongoose").Model<NotificationLog, any, any, any, Document<unknown, any, NotificationLog, any, {}> & NotificationLog & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NotificationLog, Document<unknown, {}, import("mongoose").FlatRecord<NotificationLog>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<NotificationLog> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare const NotificationPreferenceSchema: import("mongoose").Schema<NotificationPreference, import("mongoose").Model<NotificationPreference, any, any, any, Document<unknown, any, NotificationPreference, any, {}> & NotificationPreference & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, NotificationPreference, Document<unknown, {}, import("mongoose").FlatRecord<NotificationPreference>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<NotificationPreference> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
