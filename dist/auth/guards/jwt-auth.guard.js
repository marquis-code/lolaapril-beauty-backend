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
exports.JwtAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const passport_1 = require("@nestjs/passport");
const public_decorator_1 = require("../decorators/public.decorator");
let JwtAuthGuard = class JwtAuthGuard extends (0, passport_1.AuthGuard)('jwt') {
    constructor(reflector) {
        super();
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        const request = context.switchToHttp().getRequest();
        const hasAuthHeader = !!request.headers?.authorization;
        console.log('🛡️ JwtAuthGuard.canActivate:', {
            isPublic,
            hasAuthHeader,
            authHeader: hasAuthHeader ? request.headers.authorization.substring(0, 30) + '...' : 'none'
        });
        if (isPublic) {
            if (hasAuthHeader) {
                try {
                    console.log('🔄 Attempting JWT validation for public route with token...');
                    const result = await super.canActivate(context);
                    console.log('✅ JWT validation successful for public route, user attached:', !!request.user);
                }
                catch (error) {
                    console.log('⚠️ JWT validation failed for public route:', error.message);
                }
            }
            return true;
        }
        return super.canActivate(context);
    }
    handleRequest(err, user, info, context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        console.log('🛡️ JwtAuthGuard.handleRequest:', {
            isPublic,
            hasError: !!err,
            errorMessage: err?.message,
            hasUser: !!user,
            userBusinessId: user?.businessId,
            info: info?.message || info?.name || info
        });
        if (isPublic) {
            return user || undefined;
        }
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('Invalid token');
        }
        return user;
    }
};
JwtAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], JwtAuthGuard);
exports.JwtAuthGuard = JwtAuthGuard;
//# sourceMappingURL=jwt-auth.guard.js.map