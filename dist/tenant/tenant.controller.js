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
const business_dto_1 = require("./dto/business.dto");
let TenantController = class TenantController {
    constructor(tenantService) {
        this.tenantService = tenantService;
    }
    async createBusiness(createBusinessDto) {
        try {
            const business = await this.tenantService.createBusiness(createBusinessDto);
            return {
                success: true,
                data: business,
                message: 'Business created successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: error.name
            };
        }
    }
    async registerBusiness(registrationData) {
        try {
            const result = await this.tenantService.registerBusinessWithOwner(registrationData);
            return {
                success: true,
                data: result,
                message: 'Business registered successfully'
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                code: error.name
            };
        }
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
    async getBusinessesByOwner(req) {
        try {
            const userId = req.query.ownerId;
            if (!userId) {
                return {
                    success: false,
                    error: 'ownerId is required as query parameter'
                };
            }
            const businesses = await this.tenantService.getBusinessesByOwner(userId);
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
};
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new business' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Business created successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request - validation failed' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Subdomain already exists' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [business_dto_1.CreateBusinessDto]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "createBusiness", null);
__decorate([
    (0, common_1.Post)('register'),
    (0, swagger_1.ApiOperation)({ summary: 'Register a new business with owner' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "registerBusiness", null);
__decorate([
    (0, common_1.Get)('check-subdomain'),
    (0, swagger_1.ApiOperation)({ summary: 'Check if subdomain is available' }),
    __param(0, (0, common_1.Query)('subdomain')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "checkSubdomainAvailability", null);
__decorate([
    (0, common_1.Get)('businesses'),
    (0, swagger_1.ApiOperation)({ summary: 'Get businesses owned by current user' }),
    __param(0, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getBusinessesByOwner", null);
__decorate([
    (0, common_1.Get)(':businessId'),
    (0, swagger_1.ApiOperation)({ summary: 'Get business by ID' }),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getBusinessById", null);
__decorate([
    (0, common_1.Put)(':businessId'),
    (0, swagger_1.ApiOperation)({ summary: 'Update business' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "updateBusiness", null);
__decorate([
    (0, common_1.Get)(':businessId/config'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant configuration' }),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "getTenantConfig", null);
__decorate([
    (0, common_1.Put)(':businessId/config'),
    (0, swagger_1.ApiOperation)({ summary: 'Update tenant configuration' }),
    __param(0, (0, common_1.Param)('businessId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "updateTenantConfig", null);
__decorate([
    (0, common_1.Get)(':businessId/subscription/limits'),
    (0, swagger_1.ApiOperation)({ summary: 'Check subscription limits' }),
    __param(0, (0, common_1.Param)('businessId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TenantController.prototype, "checkSubscriptionLimits", null);
TenantController = __decorate([
    (0, swagger_1.ApiTags)('tenant'),
    (0, common_1.Controller)('api/tenant'),
    __metadata("design:paramtypes", [tenant_service_1.TenantService])
], TenantController);
exports.TenantController = TenantController;
//# sourceMappingURL=tenant.controller.js.map