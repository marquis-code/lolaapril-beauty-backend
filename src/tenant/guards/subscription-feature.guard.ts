// src/modules/tenant/guards/subscription-feature.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'
import { Reflector } from '@nestjs/core'

export const RequireFeature = (feature: string) => {
  return (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) => {
    Reflect.defineMetadata('required-feature', feature, descriptor?.value || target)
  }
}

@Injectable()
export class SubscriptionFeatureGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredFeature = this.reflector.get<string>(
      'required-feature',
      context.getHandler()
    )

    if (!requiredFeature) {
      return true // No feature requirement
    }

    const request = context.switchToHttp().getRequest()
    
    if (!request.tenant || !request.tenant.business.activeSubscription) {
      throw new ForbiddenException('Active subscription required')
    }

    const subscription = request.tenant.business.activeSubscription
    const hasFeature = subscription.limits?.features?.[requiredFeature]

    if (!hasFeature) {
      throw new ForbiddenException(`Feature '${requiredFeature}' not available in current subscription plan`)
    }

    return true
  }
}