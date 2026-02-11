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
import { Model, Types } from 'mongoose';
import { Ticket, TicketDocument } from './schemas/ticket.schema';
import { TicketMessage, TicketMessageDocument } from './schemas/ticket-message.schema';
import { SLAConfig, SLAConfigDocument } from './schemas/sla-config.schema';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ConfigService } from '@nestjs/config';
export declare class SupportService {
    private ticketModel;
    private ticketMessageModel;
    private slaConfigModel;
    private configService;
    constructor(ticketModel: Model<TicketDocument>, ticketMessageModel: Model<TicketMessageDocument>, slaConfigModel: Model<SLAConfigDocument>, configService: ConfigService);
    createTicket(createDto: CreateTicketDto): Promise<import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & Ticket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTicket(ticketId: string): Promise<import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & Ticket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getTickets(filter: {
        status?: string;
        priority?: string;
        assignedTo?: string;
        businessId?: string;
        page?: number;
        limit?: number;
    }): Promise<{
        tickets: (import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & Ticket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
            _id: Types.ObjectId;
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
    updateTicketStatus(ticketId: string, status: string, userId: string): Promise<import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & Ticket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    assignTicket(ticketId: string, agentId: string): Promise<import("mongoose").Document<unknown, {}, TicketDocument, {}, {}> & Ticket & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    addMessage(ticketId: string, messageData: {
        senderId: string;
        senderType: string;
        content: string;
        attachments?: string[];
        isInternal?: boolean;
        isAutomated?: boolean;
    }): Promise<import("mongoose").Document<unknown, {}, TicketMessageDocument, {}, {}> & TicketMessage & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getMessages(ticketId: string, includeInternal?: boolean): Promise<(import("mongoose").Document<unknown, {}, TicketMessageDocument, {}, {}> & TicketMessage & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    })[]>;
    createSLAConfig(businessId: string, config: any): Promise<import("mongoose").Document<unknown, {}, SLAConfigDocument, {}, {}> & SLAConfig & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    getSLAConfig(businessId: string, priority: string): Promise<import("mongoose").Document<unknown, {}, SLAConfigDocument, {}, {}> & SLAConfig & import("mongoose").Document<Types.ObjectId, any, any, Record<string, any>, {}> & Required<{
        _id: Types.ObjectId;
    }> & {
        __v: number;
    }>;
    checkSLABreaches(): Promise<number>;
    getTicketStats(businessId?: string): Promise<{
        statusStats: any[];
        priorityStats: any[];
        avgResolutionTimeMinutes: number;
    }>;
    makeCall(ticketId: string, phoneNumber: string, agentId: string): Promise<{
        success: boolean;
        message: string;
    }>;
    sendSMS(ticketId: string, phoneNumber: string, message: string): Promise<{
        success: boolean;
        message: string;
    }>;
    private generateTicketNumber;
}
