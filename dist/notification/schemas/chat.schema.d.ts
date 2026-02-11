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
export type ChatRoomDocument = ChatRoom & Document;
export type ChatMessageDocument = ChatMessage & Document;
export type ChatParticipantDocument = ChatParticipant & Document;
export type FAQDocument = FAQ & Document;
export type AutoResponseDocument = AutoResponse & Document;
export declare class ChatRoom {
    businessId: Types.ObjectId;
    roomType: string;
    roomName: string;
    isActive: boolean;
    isArchived: boolean;
    lastMessageId: Types.ObjectId;
    lastMessageAt: Date;
    unreadCount: number;
    metadata: {
        userType?: string;
        userId?: string;
        userName?: string;
        userEmail?: string;
        userPhone?: string;
        assignedStaffId?: string;
        assignedStaffName?: string;
        priority?: 'low' | 'medium' | 'high' | 'urgent';
        tags?: string[];
        customerLocation?: string;
        lastSeen?: Date;
        ownerId?: string;
        memberId?: string;
        superAdminId?: string;
    };
}
export declare const ChatRoomSchema: import("mongoose").Schema<ChatRoom, import("mongoose").Model<ChatRoom, any, any, any, Document<unknown, any, ChatRoom, any, {}> & ChatRoom & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatRoom, Document<unknown, {}, import("mongoose").FlatRecord<ChatRoom>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ChatRoom> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class ChatMessage {
    roomId: Types.ObjectId;
    businessId: Types.ObjectId;
    senderId: Types.ObjectId;
    senderType: string;
    senderName: string;
    messageType: string;
    content: string;
    attachments: string[];
    isRead: boolean;
    readAt: Date;
    isAutomated: boolean;
    isFAQ: boolean;
    faqId: Types.ObjectId;
    replyToMessageId: Types.ObjectId;
    isEdited: boolean;
    isDeleted: boolean;
    metadata: {
        deliveryStatus?: 'sent' | 'delivered' | 'read' | 'failed';
        language?: string;
        sentiment?: 'positive' | 'negative' | 'neutral';
        priority?: 'low' | 'medium' | 'high';
        tags?: string[];
        guestId?: string;
    };
}
export declare const ChatMessageSchema: import("mongoose").Schema<ChatMessage, import("mongoose").Model<ChatMessage, any, any, any, Document<unknown, any, ChatMessage, any, {}> & ChatMessage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatMessage, Document<unknown, {}, import("mongoose").FlatRecord<ChatMessage>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ChatMessage> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class ChatParticipant {
    roomId: Types.ObjectId;
    userId: Types.ObjectId;
    participantType: string;
    isActive: boolean;
    lastSeenAt: Date;
    joinedAt: Date;
    leftAt: Date;
    unreadCount: number;
    notificationsEnabled: boolean;
}
export declare const ChatParticipantSchema: import("mongoose").Schema<ChatParticipant, import("mongoose").Model<ChatParticipant, any, any, any, Document<unknown, any, ChatParticipant, any, {}> & ChatParticipant & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ChatParticipant, Document<unknown, {}, import("mongoose").FlatRecord<ChatParticipant>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<ChatParticipant> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class FAQ {
    businessId: Types.ObjectId;
    question: string;
    answer: string;
    keywords: string[];
    alternativeQuestions: string[];
    category: string;
    usageCount: number;
    isActive: boolean;
    confidenceThreshold: number;
    priority: number;
    metadata: {
        attachments?: string[];
        relatedLinks?: string[];
        tags?: string[];
        language?: string;
    };
}
export declare const FAQSchema: import("mongoose").Schema<FAQ, import("mongoose").Model<FAQ, any, any, any, Document<unknown, any, FAQ, any, {}> & FAQ & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, FAQ, Document<unknown, {}, import("mongoose").FlatRecord<FAQ>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<FAQ> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
export declare class AutoResponse {
    businessId: Types.ObjectId;
    name: string;
    responseType: string;
    message: string;
    trigger: {
        event?: 'user-joined' | 'after-hours' | 'no-staff-available' | 'high-load' | 'manual';
        conditions?: {
            dayOfWeek?: number[];
            timeRange?: {
                start: string;
                end: string;
            };
            maxWaitTime?: number;
            queueSize?: number;
        };
    };
    isActive: boolean;
    includeBusinessHours: boolean;
    includeEstimatedWaitTime: boolean;
    quickReplies: string[];
    usageCount: number;
    metadata: {
        language?: string;
        tags?: string[];
        attachments?: string[];
    };
}
export declare const AutoResponseSchema: import("mongoose").Schema<AutoResponse, import("mongoose").Model<AutoResponse, any, any, any, Document<unknown, any, AutoResponse, any, {}> & AutoResponse & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, AutoResponse, Document<unknown, {}, import("mongoose").FlatRecord<AutoResponse>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<AutoResponse> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
