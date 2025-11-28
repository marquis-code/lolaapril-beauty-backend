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
exports.TenantController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const tenant_service_1 = require("./tenant.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
let TenantController = class TenantController {
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    async checkSubdomainAvailability(subdomain) {
        try {
            const isAvailable = await this.tenantService.isSubdomainAvailable(subdomain);
            return {
                success: true,
                data: { available: isAvailable, subdomain },
                message: isAvailable ? 'Subdomain is available' : 'Subdomain is already taken'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async getBusinessesByUser(req) {
        try {
            const userId = req.user.sub;
            const businesses = await this.tenantService.getBusinessesByUser(userId);
            return {
                success: true,
                data: businesses,
                message: 'Businesses retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async getBusinessBySubdomain(subdomain) {
        try {
            const business = await this.tenantService.getBusinessBySubdomain(subdomain);
            return {
                success: true,
                data: business,
                message: 'Business retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async getBusinessById(businessId) {
        try {
            const business = await this.tenantService.getBusinessById(businessId);
            return {
                success: true,
                data: business,
                message: 'Business retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async updateBusiness(businessId, updateBusinessDto) {
        try {
            const business = await this.tenantService.updateBusiness(businessId, updateBusinessDto);
            return {
                success: true,
                data: business,
                message: 'Business updated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async addStaffMember(businessId, staffData) {
        try {
            const staff = await this.tenantService.addStaffMember(businessId, staffData);
            return {
                success: true,
                data: staff,
                message: 'Staff member added successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async removeStaffMember(businessId, staffId) {
        try {
            await this.tenantService.removeStaffMember(businessId, staffId);
            return {
                success: true,
                message: 'Staff member removed successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async addBusinessAdmin(businessId, adminId) {
        try {
            await this.tenantService.addBusinessAdmin(businessId, adminId);
            return {
                success: true,
                message: 'Admin added successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async removeBusinessAdmin(businessId, adminId) {
        try {
            await this.tenantService.removeBusinessAdmin(businessId, adminId);
            return {
                success: true,
                message: 'Admin removed successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async getTenantConfig(businessId) {
        try {
            const config = await this.tenantService.getTenantConfig(businessId);
            return {
                success: true,
                data: config,
                message: 'Tenant configuration retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async updateTenantConfig(businessId, configData) {
        try {
            const config = await this.tenantService.updateTenantConfig(businessId, configData);
            return {
                success: true,
                data: config,
                message: 'Tenant configuration updated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async checkSubscriptionLimits(businessId) {
        try {
            const limits = await this.tenantService.checkSubscriptionLimits(businessId);
            return {
                success: true,
                data: limits,
                message: 'Subscription limits retrieved successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async suspendBusiness(businessId, body) {
        try {
            await this.tenantService.suspendBusiness(businessId, body.reason);
            return {
                success: true,
                message: 'Business suspended successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
    async reactivateBusiness(businessId) {
        try {
            await this.tenantService.reactivateBusiness(businessId);
            return {
                success: true,
                message: 'Business reactivated successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }
};
__decorate([
    (0, common_1.Get)('check-subdomain'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if subdomain is available' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subdomain availability checked' }),
    __param(0, (0, common_1.Query)('subdomain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "checkSubdomainAvailability", null);
__decorate([
    (0, common_1.Get)('businesses'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get businesses by user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Businesses retrieved successfully' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getBusinessesByUser", null);
__decorate([
    (0, common_1.Get)('subdomain/:subdomain'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business by subdomain' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('subdomain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getBusinessBySubdomain", null);
__decorate([
    (0, common_1.Get)(':businessId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getBusinessById", null);
__decorate([
    (0, common_1.Put)(':businessId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "updateBusiness", null);
__decorate([
    (0, common_1.Post)(':businessId/staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Add staff member to business' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Staff member added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "addStaffMember", null);
__decorate([
    (0, common_1.Delete)(':businessId/staff/:staffId'),
    (0, swagger_1.ApiOperation)({ summary: 'Remove staff member from business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Staff member removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business or staff not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('staffId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "removeStaffMember", null);
__decorate([
    (0, common_1.Post)(':businessId/admin/:adminId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add business admin' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin added successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "addBusinessAdmin", null);
__decorate([
    (0, common_1.Delete)(':businessId/admin/:adminId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove business admin' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin removed successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Param)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "removeBusinessAdmin", null);
__decorate([
    (0, common_1.Get)(':businessId/config'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant configuration retrieved successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Configuration not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getTenantConfig", null);
__decorate([
    (0, common_1.Put)(':businessId/config'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update tenant configuration' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Tenant configuration updated successfully' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "updateTenantConfig", null);
__decorate([
    (0, common_1.Get)(':businessId/subscription/limits'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Check subscription limits' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subscription limits retrieved successfully' }),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "checkSubscriptionLimits", null);
__decorate([
    (0, common_1.Put)(':businessId/suspend'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Suspend business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business suspended successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "suspendBusiness", null);
__decorate([
    (0, common_1.Put)(':businessId/reactivate'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reactivate business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business reactivated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "reactivateBusiness", null);
TenantController = __decorate([
    (0, swagger_1.ApiTags)('tenant'),
    (0, common_1.Controller)('api/tenant'),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantController);
exports.TenantController = TenantController;
//# sourceMappingURL=tenant.controller.js.map