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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidateBusinessAccessGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../schemas/user.schema");
const business_schema_1 = require("../../business/schemas/business.schema");
const validate_business_decorator_1 = require("../decorators/validate-business.decorator");
const public_decorator_1 = require("../decorators/public.decorator");
let ValidateBusinessAccessGuard = class ValidateBusinessAccessGuard {
    constructor(reflector, userModel, businessModel) {
        this.reflector = reflector;
        this.userModel = userModel;
        this.businessModel = businessModel;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic) {
            return true;
        }
        const shouldValidate = this.reflector.getAllAndOverride(validate_business_decorator_1.VALIDATE_BUSINESS_KEY, [context.getHandler(), context.getClass()]);
        if (!shouldValidate) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        if (!user.businessId) {
            throw new common_1.UnauthorizedException('Business context required. Please login through business portal or switch to a business.');
        }
        const businessQuery = this.businessModel
            .findById(user.businessId)
            .select('_id businessName subdomain status')
            .lean();
        const business = await businessQuery.exec();
        if (!business) {
            throw new common_1.UnauthorizedException('Business not found. Your session may be outdated. Please login again.');
        }
        if (business.status === 'suspended') {
            throw new common_1.ForbiddenException('Business account is suspended. Please contact support for assistance.');
        }
        if (business.status === 'expired') {
            throw new common_1.ForbiddenException('Business subscription has expired. Please renew your subscription to continue.');
        }
        const userQuery = this.userModel
            .findById(user.sub)
            .select('_id ownedBusinesses adminBusinesses staffBusinessId')
            .lean();
        const dbUser = await userQuery.exec();
        if (!dbUser) {
            throw new common_1.UnauthorizedException('User not found');
        }
        const hasAccess = dbUser.ownedBusinesses?.some(id => id.toString() === user.businessId) ||
            dbUser.adminBusinesses?.some(id => id.toString() === user.businessId) ||
            dbUser.staffBusinessId?.toString() === user.businessId;
        if (!hasAccess) {
            throw new common_1.ForbiddenException('Access to this business has been revoked. Please refresh your session or contact your administrator.');
        }
        request.validatedBusiness = business;
        console.log(`✅ Business validated: ${business.businessName} (${business.subdomain})`);
        return true;
    }
};
ValidateBusinessAccessGuard = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(2, (0, mongoose_1.InjectModel)(business_schema_1.Business.name)),
    __metadata("design:paramtypes", [core_1.Reflector,
        mongoose_2.Model,
        mongoose_2.Model])
], ValidateBusinessAccessGuard);
exports.ValidateBusinessAccessGuard = ValidateBusinessAccessGuard;
//# sourceMappingURL=validate-business-access.guard.js.map