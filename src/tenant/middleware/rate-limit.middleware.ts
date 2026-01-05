
// src/modules/tenant/middleware/tenant-rate-limit.middleware.ts
import { Injectable, NestMiddleware, Logger, OnModuleInit } from '@nestjs/common'
import { Response, NextFunction } from 'express'
import { rateLimit, RateLimitRequestHandler } from 'express-rate-limit'
import { TenantRequest } from './tenant.middleware'

@Injectable()
export class TenantRateLimitMiddleware implements NestMiddleware, OnModuleInit {
  private readonly logger = new Logger(TenantRateLimitMiddleware.name)
  private limiters = new Map<string, RateLimitRequestHandler>()
  private planLimiters = new Map<string, RateLimitRequestHandler>()
  private defaultLimiter: RateLimitRequestHandler

  onModuleInit() {
    // Pre-initialize limiters for each plan type at module initialization
    this.defaultLimiter = this.createLimiterForPlan('trial')
    
    const plans = ['trial', 'basic', 'standard', 'premium', 'enterprise']
    plans.forEach(plan => {
      this.planLimiters.set(plan, this.createLimiterForPlan(plan))
    })

    this.logger.log('Rate limiters initialized for all plan types')
  }

  use(req: TenantRequest, res: Response, next: NextFunction) {
    // If no tenant context, use default limiter
    if (!req.tenant) {
      return this.defaultLimiter(req, res, next)
    }

    const tenantId = req.tenant.businessId
    
    // Get or create tenant-specific limiter
    let limiter = this.limiters.get(tenantId)
    
    if (!limiter) {
      const planType = req.tenant.business?.activeSubscription?.planType || 'trial'
      limiter = this.planLimiters.get(planType) || this.defaultLimiter
      this.limiters.set(tenantId, limiter)
    }
    
    // Apply rate limiting
    limiter(req, res, next)
  }

  private createLimiterForPlan(planType: string): RateLimitRequestHandler {
    const limits: Record<string, { windowMs: number; limit: number }> = {
      trial: { windowMs: 15 * 60 * 1000, limit: 100 },
      basic: { windowMs: 15 * 60 * 1000, limit: 300 },
      standard: { windowMs: 15 * 60 * 1000, limit: 600 },
      premium: { windowMs: 15 * 60 * 1000, limit: 1000 },
      enterprise: { windowMs: 15 * 60 * 1000, limit: 2000 }
    }

    const config = limits[planType] || limits.trial

    return rateLimit({
      windowMs: config.windowMs,
      limit: config.limit,
      message: {
        success: false,
        error: `Rate limit exceeded for ${planType} plan. Please try again later.`,
        code: 'RATE_LIMIT_EXCEEDED'
      },
      standardHeaders: 'draft-7',
      legacyHeaders: false,
      skip: (req) => {
        return req.path === '/health' || req.path === '/api/health'
      }
    })
  }
}