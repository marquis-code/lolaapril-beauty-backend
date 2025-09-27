// src/modules/tenant/guards/tenant.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, Logger } from '@nestjs/common'
import { TenantService } from '../tenant.service'

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name)

  constructor(private tenantService: TenantService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest()
    
    if (!request.tenant) {
      throw new ForbiddenException('Tenant not identified')
    }

    try {
      // Check if business is active
      if (request.tenant.business.status === 'suspended') {
        throw new ForbiddenException('Business account is suspended')
      }

      if (request.tenant.business.status === 'inactive') {
        throw new ForbiddenException('Business account is inactive')
      }

      // Check subscription limits for certain operations
      const limitsCheck = await this.tenantService.checkSubscriptionLimits(
        request.tenant.businessId
      )

      if (!limitsCheck.isValid) {
        // Log warning but don't block - let specific services handle limits
        this.logger.warn(`Subscription limits exceeded for business ${request.tenant.businessId}: ${limitsCheck.warnings.join(', ')}`)
      }

      // Attach limits info to request for services to use
      request.tenant.limits = limitsCheck

      return true
    } catch (error) {
      this.logger.error(`Tenant guard error: ${error.message}`)
      throw new ForbiddenException(error.message)
    }
  }
}