"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantRateLimitMiddleware = void 0;
const common_1 = require("@nestjs/common");
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
let TenantRateLimitMiddleware = class TenantRateLimitMiddleware {
    constructor() {
        this.limiters = new Map();
    }
    use(req, res, next) {
        if (!req.tenant) {
            return next();
        }
        const tenantId = req.tenant.businessId;
        let limiter = this.limiters.get(tenantId);
        if (!limiter) {
            limiter = this.createTenantLimiter(req.tenant.business.activeSubscription);
            this.limiters.set(tenantId, limiter);
        }
        limiter(req, res, next);
    }
    createTenantLimiter(subscription) {
        const limits = {
            trial: { windowMs: 15 * 60 * 1000, max: 100 },
            basic: { windowMs: 15 * 60 * 1000, max: 300 },
            standard: { windowMs: 15 * 60 * 1000, max: 600 },
            premium: { windowMs: 15 * 60 * 1000, max: 1000 },
            enterprise: { windowMs: 15 * 60 * 1000, max: 2000 }
        };
        const planType = (subscription === null || subscription === void 0 ? void 0 : subscription.planType) || 'trial';
        const config = limits[planType] || limits.trial;
        return (0, express_rate_limit_1.default)({
            windowMs: config.windowMs,
            max: config.max,
            message: {
                success: false,
                error: 'Too many requests, please try again later.',
                code: 'RATE_LIMIT_EXCEEDED'
            },
            standardHeaders: true,
            legacyHeaders: false,
        });
    }
};
TenantRateLimitMiddleware = __decorate([
    (0, common_1.Injectable)()
], TenantRateLimitMiddleware);
exports.TenantRateLimitMiddleware = TenantRateLimitMiddleware;
//# sourceMappingURL=rate-limit.middleware.js.map