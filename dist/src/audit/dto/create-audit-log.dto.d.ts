import { AuditAction } from "../../common/enums";
export declare class CreateAuditLogDto {
    userId: string;
    action: AuditAction;
    resource: string;
    resourceId?: string;
    metadata?: Record<string, any>;
    ip?: string;
    userAgent?: string;
}
