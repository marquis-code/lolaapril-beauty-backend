import { AuditService } from "./audit.service";
export declare class AuditController {
    private readonly auditService;
    constructor(auditService: AuditService);
    findAll(limit?: number, skip?: number): Promise<import("./schemas/audit-log.schema").AuditLog[]>;
    findByUser(userId: string, limit?: number): Promise<import("./schemas/audit-log.schema").AuditLog[]>;
    findByResource(resource: string, resourceId?: string): Promise<import("./schemas/audit-log.schema").AuditLog[]>;
}
