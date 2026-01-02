"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var TenantRateLimitMiddleware_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const express_rate_limit_1 = require("express-rate-limit");
let TenantRateLimitMiddleware = TenantRateLimitMiddleware_1 = class TenantRateLimitMiddleware {
    constructor() {
        this.logger = new common_1.Logger(TenantRateLimitMiddleware_1.name);
        this.limiters = new Map();
        this.planLimiters = new Map();
    }
    onModuleInit() {
        this.defaultLimiter = this.createLimiterForPlan('trial');
        const plans = ['trial', 'basic', 'standard', 'premium', 'enterprise'];
        plans.forEach(plan => {
            this.planLimiters.set(plan, this.createLimiterForPlan(plan));
        });
        this.logger.log('Rate limiters initialized for all plan types');
    }
    use(req, res, next) {
        if (!req.tenant) {
            return this.defaultLimiter(req, res, next);
        }
        const tenantId = req.tenant.businessId;
        let limiter = this.limiters.get(tenantId);
        if (!limiter) {
            const planType = req.tenant.business?.activeSubscription?.planType || 'trial';
            limiter = this.planLimiters.get(planType) || this.defaultLimiter;
            this.limiters.set(tenantId, limiter);
        }
        limiter(req, res, next);
    }
    createLimiterForPlan(planType) {
        const limits = {
            trial: { windowMs: 15 * 60 * 1000, limit: 100 },
            basic: { windowMs: 15 * 60 * 1000, limit: 300 },
            standard: { windowMs: 15 * 60 * 1000, limit: 600 },
            premium: { windowMs: 15 * 60 * 1000, limit: 1000 },
            enterprise: { windowMs: 15 * 60 * 1000, limit: 2000 }
        };
        const config = limits[planType] || limits.trial;
        return (0, express_rate_limit_1.rateLimit)({
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
                return req.path === '/health' || req.path === '/api/health';
            }
        });
    }
};
TenantRateLimitMiddleware = TenantRateLimitMiddleware_1 = __decorate([
    (0, common_1.Injectable)()
], TenantRateLimitMiddleware);
exports.TenantRateLimitMiddleware = TenantRateLimitMiddleware;
//# sourceMappingURL=rate-limit.middleware.js.map