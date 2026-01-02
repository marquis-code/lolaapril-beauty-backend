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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { SupportService } from './support.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
export declare class SupportController {
    private readonly supportService;
    constructor(supportService: SupportService);
    createTicket(createDto: CreateTicketDto): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").Ticket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTicket(id: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").Ticket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTickets(filter: any): Promise<{
        tickets: (import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").Ticket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: import("mongoose").Types.ObjectId;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    updateStatus(id: string, body: {
        status: string;
        userId: string;
    }): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").Ticket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    assignTicket(id: string, agentId: string): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ticket.schema").TicketDocument, {}, {}> & import("./schemas/ticket.schema").Ticket & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addMessage(id: string, messageData: any): Promise<import("mongoose").Document<unknown, {}, import("./schemas/ticket-message.schema").TicketMessageDocument, {}, {}> & import("./schemas/ticket-message.schema").TicketMessage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMessages(id: string, includeInternal: boolean): Promise<(import("mongoose").Document<unknown, {}, import("./schemas/ticket-message.schema").TicketMessageDocument, {}, {}> & import("./schemas/ticket-message.schema").TicketMessage & import("mongoose").Document<import("mongoose").Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: import("mongoose").Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    getStats(tenantId?: string): Promise<{
        statusStats: any[];
        priorityStats: any[];
        avgResolutionTimeMinutes: number;
    }>;
    makeCall(id: string, body: {
        phoneNumber: string;
        agentId: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
    sendSMS(id: string, body: {
        phoneNumber: string;
        message: string;
    }): Promise<{
        success: boolean;
        message: string;
    }>;
}
