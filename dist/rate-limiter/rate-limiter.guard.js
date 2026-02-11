"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RateLimiterGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const cache_service_1 = require("../cache/cache.service");
let RateLimiterGuard = class RateLimiterGuard {
    constructor(reflector, cacheService) {
        this.reflector = reflector;
        this.cacheService = cacheService;
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const ip = request.ip;
        const endpoint = request.route.path;
        const limit = this.reflector.get('rateLimit', context.getHandler()) || 100;
        const ttl = this.reflector.get('rateLimitTTL', context.getHandler()) || 60;
        const key = `rate_limit:${ip}:${endpoint}`;
        const count = await this.cacheService.incrementCounter(key, ttl);
        if (count > limit) {
            throw new common_1.HttpException({
                statusCode: common_1.HttpStatus.TOO_MANY_REQUESTS,
                message: 'Too many requests. Please try again later.',
                retryAfter: ttl,
            }, common_1.HttpStatus.TOO_MANY_REQUESTS);
        }
        const response = context.switchToHttp().getResponse();
        response.setHeader('X-RateLimit-Limit', limit);
        response.setHeader('X-RateLimit-Remaining', Math.max(0, limit - count));
        response.setHeader('X-RateLimit-Reset', new Date(Date.now() + ttl * 1000).toISOString());
        return true;
    }
};
RateLimiterGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        cache_service_1.CacheService])
], RateLimiterGuard);
exports.RateLimiterGuard = RateLimiterGuard;
//# sourceMappingURL=rate-limiter.guard.js.map