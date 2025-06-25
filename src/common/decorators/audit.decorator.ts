import { SetMetadata } from "@nestjs/common"
import { AuditAction } from "../enums"

export const AUDIT_KEY = "audit"
export const Audit = (action: AuditAction, resource: string) => SetMetadata(AUDIT_KEY, { action, resource })
