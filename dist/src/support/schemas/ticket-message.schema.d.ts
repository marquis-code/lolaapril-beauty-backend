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
import { Document, Types } from "mongoose";
export type TicketMessageDocument = TicketMessage & Document;
export declare class TicketMessage {
    ticketId: Types.ObjectId;
    senderId: Types.ObjectId;
    senderType: string;
    content: string;
    attachments: string[];
    isInternal: boolean;
    isAutomated: boolean;
    readAt: Date;
}
export declare const TicketMessageSchema: import("mongoose").Schema<TicketMessage, import("mongoose").Model<TicketMessage, any, any, any, Document<unknown, any, TicketMessage, any, {}> & TicketMessage & {
    _id: Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, TicketMessage, Document<unknown, {}, import("mongoose").FlatRecord<TicketMessage>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<TicketMessage> & {
    _id: Types.ObjectId;
} & {
    __v: number;
}>;
