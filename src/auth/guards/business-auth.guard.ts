// src/modules/auth/guards/business-auth.guard.ts
import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RequestWithUser } from '../types/request-with-user.interface'
import { UserRole } from '../schemas/user.schema'

/**
 * Guard that ensures:
 * 1. User is authenticated (has valid JWT)
 * 2. User has business context in their JWT
 * 3. User has appropriate business role (owner/admin/staff)
 * 
 * Usage:
 * @UseGuards(BusinessAuthGuard)
 */
@Injectable()
export class BusinessAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    // Check if user is authenticated
    if (!user) {
      throw new UnauthorizedException('Authentication required')
    }

    // Check if user has business context
    if (!user.businessId || !user.subdomain) {
      throw new UnauthorizedException(
        'Business context required. Please login through business portal.'
      )
    }

    // Check if user has business role
    const businessRoles = [
      UserRole.BUSINESS_OWNER,
      UserRole.BUSINESS_ADMIN,
      UserRole.STAFF
    ]

    if (!businessRoles.includes(user.role as UserRole)) {
      throw new ForbiddenException(
        'Access denied. Business account required.'
      )
    }

    // Attach business context to request for easy access
    (request as any).businessContext = {
      businessId: user.businessId,
      subdomain: user.subdomain,
      userId: user.sub,
      userRole: user.role
    }

    return true
  }
}

/**
 * Metadata key for requiring specific business roles
 */
export const BUSINESS_ROLES_KEY = 'businessRoles'

/**
 * Decorator to specify required business roles
 * Usage:
 * @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
 */
export const RequireBusinessRoles = (...roles: UserRole[]) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    if (descriptor) {
      Reflect.defineMetadata(BUSINESS_ROLES_KEY, roles, descriptor.value)
    } else {
      Reflect.defineMetadata(BUSINESS_ROLES_KEY, roles, target)
    }
  }
}

/**
 * Guard that checks for specific business roles
 * Should be used in combination with JwtAuthGuard
 * 
 * Usage:
 * @UseGuards(JwtAuthGuard, BusinessRolesGuard)
 * @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
 */
@Injectable()
export class BusinessRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      BUSINESS_ROLES_KEY,
      [context.getHandler(), context.getClass()]
    )

    if (!requiredRoles || requiredRoles.length === 0) {
      return true
    }

    const request = context.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    if (!user) {
      throw new UnauthorizedException('Authentication required')
    }

    if (!user.businessId) {
      throw new UnauthorizedException('Business context required')
    }

    const hasRole = requiredRoles.some(role => user.role === role)

    if (!hasRole) {
      throw new ForbiddenException(
        `Access denied. Required roles: ${requiredRoles.join(', ')}`
      )
    }

    return true
  }
}