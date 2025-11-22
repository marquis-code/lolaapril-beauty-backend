import { AuditAction, AuditEntity } from "../schemas/audit-log.schema";
export interface AuditOptions {
    action: AuditAction;
    entity: AuditEntity;
    description?: string;
}
export declare const AUDIT_KEY = "audit";
export declare const Audit: (options: AuditOptions) => import("@nestjs/common").CustomDecorator<string>;
