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
exports.BusinessRolesGuard = exports.RequireBusinessRoles = exports.BUSINESS_ROLES_KEY = exports.BusinessAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const user_schema_1 = require("../schemas/user.schema");
let BusinessAuthGuard = class BusinessAuthGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        if (!user.businessId || !user.subdomain) {
            throw new common_1.UnauthorizedException('Business context required. Please login through business portal.');
        }
        const businessRoles = [
            user_schema_1.UserRole.BUSINESS_OWNER,
            user_schema_1.UserRole.BUSINESS_ADMIN,
            user_schema_1.UserRole.STAFF
        ];
        if (!businessRoles.includes(user.role)) {
            throw new common_1.ForbiddenException('Access denied. Business account required.');
        }
        request.businessContext = {
            businessId: user.businessId,
            subdomain: user.subdomain,
            userId: user.sub,
            userRole: user.role
        };
        return true;
    }
};
BusinessAuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], BusinessAuthGuard);
exports.BusinessAuthGuard = BusinessAuthGuard;
exports.BUSINESS_ROLES_KEY = 'businessRoles';
const RequireBusinessRoles = (...roles) => {
    return (target, propertyKey, descriptor) => {
        if (descriptor) {
            Reflect.defineMetadata(exports.BUSINESS_ROLES_KEY, roles, descriptor.value);
        }
        else {
            Reflect.defineMetadata(exports.BUSINESS_ROLES_KEY, roles, target);
        }
    };
};
exports.RequireBusinessRoles = RequireBusinessRoles;
let BusinessRolesGuard = class BusinessRolesGuard {
    constructor(reflector) {
        this.reflector = reflector;
    }
    canActivate(context) {
        const requiredRoles = this.reflector.getAllAndOverride(exports.BUSINESS_ROLES_KEY, [context.getHandler(), context.getClass()]);
        if (!requiredRoles || requiredRoles.length === 0) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        if (!user.businessId) {
            throw new common_1.UnauthorizedException('Business context required');
        }
        const hasRole = requiredRoles.some(role => user.role === role);
        if (!hasRole) {
            throw new common_1.ForbiddenException(`Access denied. Required roles: ${requiredRoles.join(', ')}`);
        }
        return true;
    }
};
BusinessRolesGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector])
], BusinessRolesGuard);
exports.BusinessRolesGuard = BusinessRolesGuard;
//# sourceMappingURL=business-auth.guard.js.map