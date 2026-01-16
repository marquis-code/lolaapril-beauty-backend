// // src/modules/auth/decorators/business-context.decorator.ts
// import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'
// import { RequestWithUser } from '../types/request-with-user.interface'

// export interface BusinessContext {
//   businessId: string
//   subdomain: string
//   userId: string
//   userEmail: string
//   userRole: string
// }

// /**
//  * Decorator to extract business context from JWT payload
//  * Throws UnauthorizedException if business context is not present
//  * 
//  * Usage in controller:
//  * @Get('some-endpoint')
//  * 
//  * async someMethod(@BusinessContext() context: BusinessContext) {
//  *   console.log('Business ID:', context.businessId)
//  *   console.log('User ID:', context.userId)
//  * }
//  */
// export const BusinessContext = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): BusinessContext => {
//     const request = ctx.switchToHttp().getRequest<RequestWithUser>()
//     const user = request.user

//     if (!user) {
//       throw new UnauthorizedException('User not authenticated')
//     }

//     if (!user.businessId || !user.subdomain) {
//       throw new UnauthorizedException('Business context not found. This endpoint requires business authentication.')
//     }

//     return {
//       businessId: user.businessId,
//       subdomain: user.subdomain,
//       userId: user.sub || user.userId,
//       userEmail: user.email,
//       userRole: user.role
//     }
//   }
// )

// /**
//  * Decorator to extract just the business ID
//  * Throws UnauthorizedException if business ID is not present
//  */
// export const BusinessId = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext): string => {
//     const request = ctx.switchToHttp().getRequest<RequestWithUser>()
//     const user = request.user

//     if (!user?.businessId) {
//       throw new UnauthorizedException('Business ID not found in request')
//     }

//     return user.businessId
//   }
// )

// /**
//  * Decorator to extract the current user (from JWT payload)
//  */
// export const CurrentUser = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest<RequestWithUser>()
//     return request.user
//   }
// )

// src/modules/auth/decorators/business-context.decorator.ts
import { createParamDecorator, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { RequestWithUser } from '../types/request-with-user.interface'
import { IS_PUBLIC_KEY } from './public.decorator'

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
 * For protected routes: Throws UnauthorizedException if business ID is not present
 * For public routes: Returns undefined if business ID is not present
 * 
 * This allows the decorator to work with both @Public() and protected endpoints
 */
export const BusinessId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    // Check if this is a public route
    const reflector = new Reflector()
    const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ])

    // For public routes, return undefined if no business context
    if (isPublic) {
      return user?.businessId
    }

    // For protected routes, throw error if no business context
    if (!user?.businessId) {
      throw new UnauthorizedException('Business ID not found in request')
    }

    return user.businessId
  }
)

/**
 * Decorator to extract the current user (from JWT payload)
 * For public routes: Returns undefined if no user
 * For protected routes: Throws error if no user
 */
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    // Check if this is a public route
    const reflector = new Reflector()
    const isPublic = reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ])

    // For public routes, return undefined if no user
    if (isPublic) {
      return user
    }

    // For protected routes, throw error if no user
    if (!user) {
      throw new UnauthorizedException('User not authenticated')
    }

    return user
  }
)

/**
 * Optional version of BusinessId that never throws
 * Always returns string | undefined
 * Use this when you want to handle missing businessId gracefully
 */
export const OptionalBusinessId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>()
    return request.user?.businessId
  }
)

/**
 * Optional version of BusinessContext that never throws
 * Always returns BusinessContext | undefined
 */
export const OptionalBusinessContext = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): BusinessContext | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>()
    const user = request.user

    if (!user?.businessId || !user?.subdomain) {
      return undefined
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