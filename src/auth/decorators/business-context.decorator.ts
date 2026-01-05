// src/modules/auth/decorators/business-context.decorator.ts
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { RequestWithUser } from '../types/request-with-user.interface'

export interface BusinessContext {
  businessId: string
  subdomain: string
  userId: string
  userEmail: string
  userRole: string
}

/**
 * Decorator to extract business context from JWT payload
 * Throws UnauthorizedException if business context is not present
 * 
 * Usage in controller:
 * @Get('some-endpoint')
 * @UseGuards(JwtAuthGuard)
 * async someMethod(@BusinessContext() context: BusinessContext) {
 *   console.log('Business ID:', context.businessId)
 *   console.log('User ID:', context.userId)
 * }
 */
export const BusinessContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): BusinessContext => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    if (!user) {
      throw new UnauthorizedException('User not authenticated')
    }

    if (!user.businessId || !user.subdomain) {
      throw new UnauthorizedException('Business context not found. This endpoint requires business authentication.')
    }

    return {
      businessId: user.businessId,
      subdomain: user.subdomain,
      userId: user.sub || user.userId,
      userEmail: user.email,
      userRole: user.role
    }
  }
)

/**
 * Decorator to extract just the business ID
 * Throws UnauthorizedException if business ID is not present
 */
export const BusinessId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    if (!user?.businessId) {
      throw new UnauthorizedException('Business ID not found in request')
    }

    return user.businessId
  }
)

/**
 * Decorator to extract the current user (from JWT payload)
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>()
    return request.user
  }
)