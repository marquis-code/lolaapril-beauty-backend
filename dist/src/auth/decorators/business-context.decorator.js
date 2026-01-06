"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurrentUser = exports.BusinessId = exports.BusinessContext = void 0;
const common_1 = require("@nestjs/common");
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
    if (!user?.businessId) {
        throw new common_1.UnauthorizedException('Business ID not found in request');
    }
    return user.businessId;
});
exports.CurrentUser = (0, common_1.createParamDecorator)((data, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
});
//# sourceMappingURL=business-context.decorator.js.map