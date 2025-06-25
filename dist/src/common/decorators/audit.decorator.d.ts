import { AuditAction } from "../enums";
export declare const AUDIT_KEY = "audit";
export declare const Audit: (action: AuditAction, resource: string) => import("@nestjs/common").CustomDecorator<string>;
