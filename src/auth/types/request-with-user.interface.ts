
// src/modules/auth/interfaces/request-with-user.interface.ts
import { Request } from "express"
import { UserRole } from "../schemas/user.schema"

export interface JwtPayload {
  sub: string              // User ID
  userId: string           // User ID (duplicate for compatibility)
  email: string
  role: UserRole
  businessId?: string      // Business ID (for business users)
  subdomain?: string       // Business subdomain
  iat?: number            // Issued at
  exp?: number            // Expiration
}

export interface RequestWithUser extends Request {
  user: JwtPayload
}

// Helper type guard to check if user has business context
export function hasBusinessContext(user: JwtPayload): user is Required<Pick<JwtPayload, 'sub' | 'email' | 'role' | 'businessId' | 'subdomain'>> & JwtPayload {
  return !!(user.businessId && user.subdomain)
}