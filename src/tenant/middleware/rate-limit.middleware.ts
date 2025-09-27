import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import rateLimit from 'express-rate-limit'

@Injectable()
export class TenantRateLimitMiddleware implements NestMiddleware {
  private limiters = new Map<string, any>()

  use(req: Request, res: Response, next: NextFunction) {
    if (!req.tenant) {
      return next()
    }

    const tenantId = req.tenant.businessId
    
    // Get or create rate limiter for this tenant
    let limiter = this.limiters.get(tenantId)
    
    if (!limiter) {
      limiter = this.createTenantLimiter(req.tenant.business.activeSubscription)
      this.limiters.set(tenantId, limiter)
    }
    
    // Apply rate limiting
    limiter(req, res, next)
  }

  private createTenantLimiter(subscription: any) {
    // Different rate limits based on subscription plan
    const limits = {
      trial: { windowMs: 15 * 60 * 1000, max: 100 }, // 100 requests per 15 minutes
      basic: { windowMs: 15 * 60 * 1000, max: 300 },
      standard: { windowMs: 15 * 60 * 1000, max: 600 },
      premium: { windowMs: 15 * 60 * 1000, max: 1000 },
      enterprise: { windowMs: 15 * 60 * 1000, max: 2000 }
    }

    const planType = subscription?.planType || 'trial'
    const config = limits[planType] || limits.trial

    return rateLimit({
      windowMs: config.windowMs,
      max: config.max,
      message: {
        success: false,
        error: 'Too many requests, please try again later.',
        code: 'RATE_LIMIT_EXCEEDED'
      },
      standardHeaders: true,
      legacyHeaders: false,
    })
  }
}