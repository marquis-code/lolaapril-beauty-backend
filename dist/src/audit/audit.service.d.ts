import { Model } from "mongoose";
import { AuditLog, AuditLogDocument } from "./schemas/audit-log.schema";
import { CreateAuditLogDto } from "./dto/create-audit-log.dto";
export declare class AuditService {
    private auditLogModel;
    constructor(auditLogModel: Model<AuditLogDocument>);
    createAuditLog(createAuditLogDto: CreateAuditLogDto): Promise<AuditLog>;
    findAll(limit?: number, skip?: number): Promise<AuditLog[]>;
    findByUser(userId: string, limit?: number): Promise<AuditLog[]>;
    findByResource(resource: string, resourceId?: string): Promise<AuditLog[]>;
}
