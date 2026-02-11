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
exports.BusinessController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const business_service_1 = require("./business.service");
const storefront_dto_1 = require("./dto/storefront.dto");
const auth_1 = require("../auth");
let BusinessController = class BusinessController {
    constructor(businessService) {
        this.businessService = businessService;
    }
    async getBusinessWorkingHours(businessId) {
        const hours = await this.businessService.getBusinessWorkingHours(businessId);
        return {
            success: true,
            data: hours,
            message: "Business working hours retrieved successfully"
        };
    }
    async createBusinessWorkingHours(businessId, workingHours) {
        const result = await this.businessService.createBusinessWorkingHours(businessId, workingHours);
        return {
            success: true,
            data: result,
            message: "Business working hours created successfully"
        };
    }
    async updateBusinessWorkingHours(businessId, workingHours) {
        const result = await this.businessService.updateBusinessWorkingHours(businessId, workingHours);
        return {
            success: true,
            data: result,
            message: "Business working hours updated successfully"
        };
    }
    async checkSubdomainAvailability(subdomain) {
        const isAvailable = await this.businessService.isSubdomainAvailable(subdomain);
        return {
            success: true,
            data: { available: isAvailable, subdomain },
            message: isAvailable ? 'Subdomain is available' : 'Subdomain is already taken'
        };
    }
    async getBySubdomain(subdomain) {
        const business = await this.businessService.getBySubdomain(subdomain);
        return {
            success: true,
            data: business,
            message: 'Business retrieved successfully'
        };
    }
    async getStorefront(subdomain) {
        return this.businessService.getPublicStorefront(subdomain);
    }
    async getById(id) {
        const business = await this.businessService.getById(id);
        return {
            success: true,
            data: business,
            message: 'Business retrieved successfully'
        };
    }
    async getMyBusinesses(user) {
        const businesses = await this.businessService.getBusinessesByUser(user.sub);
        return {
            success: true,
            data: businesses,
            message: 'Businesses retrieved successfully'
        };
    }
    async addAdmin(id, adminId, businessId) {
        if (businessId !== id) {
            return { success: false, error: 'Access denied' };
        }
        await this.businessService.addAdmin(id, adminId);
        return {
            success: true,
            message: 'Admin added successfully'
        };
    }
    async removeAdmin(id, adminId, businessId) {
        if (businessId !== id) {
            return { success: false, error: 'Access denied' };
        }
        await this.businessService.removeAdmin(id, adminId);
        return {
            success: true,
            message: 'Admin removed successfully'
        };
    }
    async getSettings(id) {
        const settings = await this.businessService.getSettings(id);
        return {
            success: true,
            data: settings,
            message: 'Settings retrieved successfully'
        };
    }
    async updateSettings(id, businessId, settings) {
        if (businessId !== id) {
            return { success: false, error: 'Access denied' };
        }
        const updated = await this.businessService.updateSettings(id, settings);
        return {
            success: true,
            data: updated,
            message: 'Settings updated successfully'
        };
    }
    async verifyKYC(id, user) {
        const result = await this.businessService.verifyBusinessKYC(id, user.sub);
        return {
            success: true,
            data: result,
            message: 'Business verified and subaccount created successfully'
        };
    }
    async rejectKYC(id, body, user) {
        if (!body.reason) {
            return { success: false, error: 'Rejection reason is required' };
        }
        const result = await this.businessService.rejectBusinessKYC(id, body.reason, user.sub);
        return {
            success: true,
            data: result,
            message: 'KYC verification rejected'
        };
    }
    async createSubaccount(id) {
        const result = await this.businessService.createPaystackSubaccount(id);
        return {
            success: true,
            data: result,
            message: 'Subaccount created successfully'
        };
    }
    async getSubaccount(id, businessId) {
        if (businessId !== id) {
            return { success: false, error: 'Access denied' };
        }
        const subaccount = await this.businessService.getSubaccountDetails(id);
        return {
            success: true,
            data: subaccount,
            message: 'Subaccount details retrieved successfully'
        };
    }
};
__decorate([
    (0, common_1.Get)("working-hours"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get business working hours" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Business working hours retrieved" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getBusinessWorkingHours", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Post)("working-hours"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Create business working hours" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Business working hours created" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "createBusinessWorkingHours", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Put)("working-hours"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Update business working hours" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Business working hours updated" }),
    __param(0, (0, auth_1.BusinessId)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "updateBusinessWorkingHours", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)('check-subdomain'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if subdomain is available (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subdomain availability checked' }),
    __param(0, (0, common_1.Query)('subdomain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "checkSubdomainAvailability", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)('subdomain/:subdomain'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business by subdomain (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business retrieved successfully' }),
    __param(0, (0, common_1.Param)('subdomain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getBySubdomain", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)('storefront/:subdomain'),
    (0, swagger_1.ApiOperation)({
        summary: 'Get complete storefront data for booking widget (Public)',
        description: 'Returns business info, theme, services, categories, and staff for the public booking page'
    }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Storefront data retrieved successfully',
        type: storefront_dto_1.StorefrontResponseDto
    }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Business not found' }),
    __param(0, (0, common_1.Param)('subdomain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getStorefront", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business by ID (Public)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Business retrieved successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getById", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all businesses for authenticated user' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Businesses retrieved successfully' }),
    __param(0, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getMyBusinesses", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Post)(':id/admin/:adminId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Add business admin' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin added successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('adminId')),
    __param(2, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "addAdmin", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Delete)(':id/admin/:adminId'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Remove business admin' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Admin removed successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('adminId')),
    __param(2, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "removeAdmin", null);
__decorate([
    (0, common_1.Get)(':id/settings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get business settings' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getSettings", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Put)(':id/settings'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Update business settings' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.BusinessId)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "updateSettings", null);
__decorate([
    (0, common_1.Post)(':id/verify-kyc'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Verify business KYC and create Paystack subaccount (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC verified and subaccount created' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "verifyKYC", null);
__decorate([
    (0, common_1.Post)(':id/reject-kyc'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Reject business KYC with reason (Admin only)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'KYC rejected' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, auth_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "rejectKYC", null);
__decorate([
    (0, common_1.Post)(':id/create-subaccount'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create Paystack subaccount for verified business' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subaccount created successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "createSubaccount", null);
__decorate([
    (0, auth_1.ValidateBusiness)(),
    (0, common_1.Get)(':id/subaccount'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get business subaccount details' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Subaccount details retrieved' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], BusinessController.prototype, "getSubaccount", null);
BusinessController = __decorate([
    (0, swagger_1.ApiTags)('Business Management'),
    (0, common_1.Controller)('businesses'),
    __metadata("design:paramtypes", [business_service_1.BusinessService])
], BusinessController);
exports.BusinessController = BusinessController;
//# sourceMappingURL=business.controller.js.map