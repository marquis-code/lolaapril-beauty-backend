import { SetMetadata } from "@nestjs/common"
import { AuditAction, AuditEntity } from "../schemas/audit-log.schema"

export interface AuditOptions {
  action: AuditAction
  entity: AuditEntity
  description?: string
}

export const AUDIT_KEY = "audit"
export const Audit = (options: AuditOptions) => SetMetadata(AUDIT_KEY, options)
