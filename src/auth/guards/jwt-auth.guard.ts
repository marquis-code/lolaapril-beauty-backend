
import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { AuthGuard } from '@nestjs/passport'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if route is marked as public
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest()
    const hasAuthHeader = !!request.headers?.authorization

    console.log('🛡️ JwtAuthGuard.canActivate:', {
      isPublic,
      hasAuthHeader,
      authHeader: hasAuthHeader ? request.headers.authorization.substring(0, 30) + '...' : 'none'
    })

    if (isPublic) {
      // For public routes, still try to authenticate if a token is provided
      if (hasAuthHeader) {
        try {
          console.log('🔄 Attempting JWT validation for public route with token...')
          const result = await super.canActivate(context)
          console.log('✅ JWT validation successful for public route, user attached:', !!request.user)
        } catch (error) {
          console.log('⚠️ JWT validation failed for public route:', error.message)
          // Ignore authentication errors on public routes
        }
      }
      return true
    }

    // Otherwise, proceed with JWT authentication (will throw if invalid)
    return super.canActivate(context) as Promise<boolean>
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    console.log('🛡️ JwtAuthGuard.handleRequest:', {
      isPublic,
      hasError: !!err,
      errorMessage: err?.message,
      hasUser: !!user,
      userBusinessId: user?.businessId,
      info: info?.message || info?.name || info
    })

    // For public routes, return user if present, otherwise undefined
    if (isPublic) {
      return user || undefined
    }

    // For protected routes, throw error if no user
    if (err || !user) {
      throw err || new UnauthorizedException('Invalid token')
    }
    return user
  }
}