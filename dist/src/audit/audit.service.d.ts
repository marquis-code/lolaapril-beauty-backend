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
import { Model } from "mongoose";
import { AuditLog, AuditLogDocument, AuditAction, AuditEntity } from "./schemas/audit-log.schema";
export interface CreateAuditLogDto {
    userId: string;
    action: AuditAction;
    entity: AuditEntity;
    entityId: string;
    description: string;
    previousData?: any;
    newData?: any;
    ipAddress?: string;
    userAgent?: string;
    metadata?: any;
}
export declare class AuditService {
    private auditLogModel;
    constructor(auditLogModel: Model<AuditLogDocument>);
    createLog(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog>;
    getAuditLogs(filters: {
        userId?: string;
        entity?: AuditEntity;
        entityId?: string;
        action?: AuditAction;
        startDate?: Date;
        endDate?: Date;
        page?: number;
        limit?: number;
    }): Promise<{
        logs: (import("mongoose").Document<unknown, {}, AuditLogDocument, {}, {}> & AuditLog & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
            _id: unknown;
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
    getEntityHistory(entity: AuditEntity, entityId: string): Promise<(import("mongoose").Document<unknown, {}, AuditLogDocument, {}, {}> & AuditLog & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    getUserActivity(userId: string, limit?: number): Promise<(import("mongoose").Document<unknown, {}, AuditLogDocument, {}, {}> & AuditLog & import("mongoose").Document<unknown, any, any, Record<string, any>, {}> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
}
