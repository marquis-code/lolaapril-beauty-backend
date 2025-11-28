// src/types/tenant-request.interface.ts
import { Request } from 'express'

export interface TenantRequest extends Request {
  tenant?: {
    businessId: string
    business: any
    limits?: any
  }
  user?: {
    sub: string
    id: string
    email: string
    role: string
  }
}