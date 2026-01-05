// src/modules/auth/guards/optional-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

/**
 * Optional Authentication Guard
 * 
 * This guard allows endpoints to be accessed both with and without authentication.
 * If a valid JWT token is provided, the user will be attached to the request.
 * If no token or an invalid token is provided, the request continues without a user.
 * 
 * Use this for endpoints that can benefit from authentication but don't require it.
 * 
 * Example use cases:
 * - Public availability endpoints that show more details when authenticated
 * - Product pages that show personalized content for logged-in users
 * - Search endpoints that remember preferences when authenticated
 * 
 * Usage:
 * @UseGuards(OptionalAuthGuard)
 * async getAvailableSlots(
 *   @CurrentUser() user: RequestWithUser['user'] | undefined,
 *   @Query() dto: GetAvailableSlotsDto
 * ) {
 *   if (user) {
 *     // User is authenticated - show enhanced data
 *   } else {
 *     // User is not authenticated - show public data
 *   }
 * }
 */
@Injectable()
export class OptionalAuthGuard extends AuthGuard('jwt') {
  /**
   * Override handleRequest to not throw errors on authentication failure
   */
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    // If there's an error or no user, just return undefined instead of throwing
    // This allows the request to continue without authentication
    if (err || !user) {
      return undefined
    }
    
    return user
  }

  /**
   * Override canActivate to always return true
   * This ensures the request proceeds regardless of authentication status
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      // Try to authenticate using the parent class method
      await super.canActivate(context)
    } catch (error) {
      // If authentication fails, that's okay - we'll just proceed without a user
    }
    
    // Always return true to allow the request to proceed
    return true
  }
}

/**
 * Example usage in controller:
 * 
 * @Get('products')
 * @UseGuards(OptionalAuthGuard)
 * async getProducts(
 *   @CurrentUser() user: RequestWithUser['user'] | undefined,
 *   @Query() filters: ProductFiltersDto
 * ) {
 *   const baseQuery = { ...filters }
 *   
 *   if (user) {
 *     // User is authenticated - add personalization
 *     return this.productsService.getPersonalizedProducts(
 *       baseQuery,
 *       user.sub,
 *       user.businessId
 *     )
 *   } else {
 *     // User is not authenticated - return public results
 *     return this.productsService.getPublicProducts(baseQuery)
 *   }
 * }
 */