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
var TenantGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantGuard = void 0;
const common_1 = require("@nestjs/common");
const tenant_service_1 = require("../tenant.service");
let TenantGuard = TenantGuard_1 = class TenantGuard {
    constructor(tenantService) {
        this.tenantService = tenantService;
        this.logger = new common_1.Logger(TenantGuard_1.name);
    }
    async canActivate(context) {
        const request = context.switchToHttp().getRequest();
        if (!request.tenant) {
            throw new common_1.ForbiddenException('Tenant not identified');
        }
        try {
            if (request.tenant.business.status === 'suspended') {
                throw new common_1.ForbiddenException('Business account is suspended');
            }
            if (request.tenant.business.status === 'inactive') {
                throw new common_1.ForbiddenException('Business account is inactive');
            }
            const limitsCheck = await this.tenantService.checkSubscriptionLimits(request.tenant.businessId);
            if (!limitsCheck.isValid) {
                this.logger.warn(`Subscription limits exceeded for business ${request.tenant.businessId}: ${limitsCheck.warnings.join(', ')}`);
            }
            request.tenant.limits = limitsCheck;
            return true;
        }
        catch (error) {
            this.logger.error(`Tenant guard error: ${error.message}`);
            throw new common_1.ForbiddenException(error.message);
        }
    }
};
TenantGuard = TenantGuard_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantGuard);
exports.TenantGuard = TenantGuard;
//# sourceMappingURL=tenant.guard.js.map