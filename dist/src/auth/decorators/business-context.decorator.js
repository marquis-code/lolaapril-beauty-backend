"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptionalBusinessContext = exports.OptionalBusinessId = exports.CurrentUser = exports.BusinessId = exports.BusinessContext = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const public_decorator_1 = require("./public.decorator");
exports.BusinessContext = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
        throw new common_1.UnauthorizedException('User not authenticated');
    }
    if (!user.businessId || !user.subdomain) {
        throw new common_1.UnauthorizedException('Business context not found. This endpoint requires business authentication.');
    }
    return {
        businessId: user.businessId,
        subdomain: user.subdomain,
        userId: user.sub || user.userId,
        userEmail: user.email,
        userRole: user.role
    };
});
exports.BusinessId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const reflector = new core_1.Reflector();
    const isPublic = reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
    ]);
    if (isPublic) {
        return user?.businessId;
    }
    if (!user?.businessId) {
        throw new common_1.UnauthorizedException('Business ID not found in request');
    }
    return user.businessId;
});
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const reflector = new core_1.Reflector();
    const isPublic = reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
        ctx.getHandler(),
        ctx.getClass(),
    ]);
    if (isPublic) {
        return user;
    }
    if (!user) {
        throw new common_1.UnauthorizedException('User not authenticated');
    }
    return user;
});
exports.OptionalBusinessId = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.businessId;
});
exports.OptionalBusinessContext = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    if (!user?.businessId || !user?.subdomain) {
        return undefined;
    }
    return {
        businessId: user.businessId,
        subdomain: user.subdomain,
        userId: user.sub || user.userId,
        userEmail: user.email,
        userRole: user.role
    };
});
//# sourceMappingURL=business-context.decorator.js.map