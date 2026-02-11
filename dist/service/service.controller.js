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
exports.ServiceController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const service_service_1 = require("./service.service");
const create_service_category_dto_1 = require("./dto/create-service-category.dto");
const create_service_dto_1 = require("./dto/create-service.dto");
const create_service_bundle_dto_1 = require("./dto/create-service-bundle.dto");
const service_variant_dto_1 = require("./dto/service-variant.dto");
const update_service_category_dto_1 = require("./dto/update-service-category.dto");
const update_service_dto_1 = require("./dto/update-service.dto");
const update_service_bundle_dto_1 = require("./dto/update-service-bundle.dto");
const service_query_dto_1 = require("./dto/service-query.dto");
const bulk_create_categories_dto_1 = require("./dto/bulk-create-categories.dto");
const bulk_create_services_dto_1 = require("./dto/bulk-create-services.dto");
const service_category_schema_1 = require("./schemas/service-category.schema");
const service_schema_1 = require("./schemas/service.schema");
const service_bundle_schema_1 = require("./schemas/service-bundle.schema");
const api_response_decorator_1 = require("../common/decorators/api-response.decorator");
const auth_1 = require("../auth");
let ServiceController = class ServiceController {
    constructor(serviceService) {
        this.serviceService = serviceService;
    }
    createCategory(createCategoryDto, businessId) {
        console.log('📝 Create Category Request:');
        console.log('  - businessId:', businessId);
        console.log('  - categoryData:', createCategoryDto);
        return this.serviceService.createCategory(createCategoryDto, businessId);
    }
    bulkCreateCategories(bulkCreateDto, businessId) {
        console.log('📦 Bulk Create Categories Request:');
        console.log('  - businessId:', businessId);
        console.log('  - count:', bulkCreateDto.categories.length);
        return this.serviceService.bulkCreateCategories(bulkCreateDto.categories, businessId);
    }
    findAllCategories(subdomain, businessId, req) {
        console.log('📂 Categories Request DEBUG:');
        console.log('  - subdomain param:', subdomain);
        console.log('  - businessId from decorator:', businessId);
        console.log('  - req.user:', req?.user);
        console.log('  - req.headers.authorization:', req?.headers?.authorization ? '✅ Present' : '❌ Missing');
        return this.serviceService.findAllCategories(subdomain, businessId);
    }
    updateCategory(id, updateCategoryDto) {
        return this.serviceService.updateCategory(id, updateCategoryDto);
    }
    create(createServiceDto, businessId) {
        console.log('📝 Create Service Request:');
        console.log('  - businessId:', businessId);
        console.log('  - serviceData:', createServiceDto);
        return this.serviceService.createService(createServiceDto, businessId);
    }
    bulkCreateServices(bulkCreateDto, businessId) {
        console.log('📦 Bulk Create Services Request:');
        console.log('  - businessId:', businessId);
        console.log('  - count:', bulkCreateDto.services.length);
        return this.serviceService.bulkCreateServices(bulkCreateDto.services, businessId);
    }
    findAll(query, businessId, req) {
        console.log('🔍 Services Request DEBUG:');
        console.log('  - subdomain param:', query.subdomain);
        console.log('  - businessId from decorator:', businessId);
        console.log('  - req.user exists:', !!req?.user);
        console.log('  - req.user full:', JSON.stringify(req?.user, null, 2));
        console.log('  - Authorization header:', req?.headers?.authorization ?
            `✅ ${req.headers.authorization.substring(0, 20)}...` : '❌ Missing');
        return this.serviceService.findAllServices(query, businessId);
    }
    getStats(businessId) {
        return this.serviceService.getServiceStats(businessId);
    }
    createBundle(createBundleDto, businessId) {
        console.log('📦 Create Bundle Request:');
        console.log('  - businessId:', businessId);
        console.log('  - bundleData:', createBundleDto);
        return this.serviceService.createBundle(createBundleDto, businessId);
    }
    findAllBundles(subdomain, businessId) {
        console.log('📦 Bundles Request:', { subdomain, businessId });
        return this.serviceService.findAllBundles(subdomain, businessId);
    }
    findOneBundle(id) {
        return this.serviceService.findOneBundle(id);
    }
    updateBundle(id, updateBundleDto) {
        return this.serviceService.updateBundle(id, updateBundleDto);
    }
    findOne(id) {
        console.log('🎯 Service by ID:', id);
        return this.serviceService.findOneService(id);
    }
    update(id, updateServiceDto) {
        return this.serviceService.updateService(id, updateServiceDto);
    }
    addVariant(id, variantDto) {
        return this.serviceService.addServiceVariant(id, variantDto);
    }
    remove(id) {
        return this.serviceService.removeService(id);
    }
};
__decorate([
    (0, common_1.Post)("categories"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new service category" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_category_schema_1.ServiceCategory, 201, "Service category created successfully"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_category_dto_1.CreateServiceCategoryDto, String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Post)("categories/bulk"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Bulk create service categories" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Service categories created successfully",
        schema: {
            example: {
                success: true,
                data: {
                    created: [{ categoryName: "Hair Services", appointmentColor: "Blue" }],
                    failed: [{ category: "Duplicate Category", error: "Category already exists" }]
                },
                message: "Successfully created 1 categories, 1 failed"
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_create_categories_dto_1.BulkCreateServiceCategoriesDto, String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "bulkCreateCategories", null);
__decorate([
    (0, common_1.Get)("categories"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all service categories (Public with subdomain or authenticated)" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_category_schema_1.ServiceCategory),
    __param(0, (0, common_1.Query)('subdomain')),
    __param(1, (0, auth_1.OptionalBusinessId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Patch)("categories/:id"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Update a service category" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_category_schema_1.ServiceCategory),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_category_dto_1.UpdateServiceCategoryDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new service" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_schema_1.Service, 201, "Service created successfully"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_dto_1.CreateServiceDto, String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "create", null);
__decorate([
    (0, common_1.Post)("bulk"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Bulk create services" }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: "Services created successfully",
        schema: {
            example: {
                success: true,
                data: {
                    created: [{ basicDetails: { serviceName: "Men's Haircut" } }],
                    failed: [{ service: "Duplicate Service", error: "Service already exists" }]
                },
                message: "Successfully created 1 services, 1 failed"
            }
        }
    }),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [bulk_create_services_dto_1.BulkCreateServicesDto, String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "bulkCreateServices", null);
__decorate([
    (0, common_1.Get)(),
    (0, auth_1.Public)(),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all services with filtering and pagination (Public with subdomain or authenticated)" }),
    (0, api_response_decorator_1.ApiPaginatedResponse)(service_schema_1.Service),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, auth_1.OptionalBusinessId)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [service_query_dto_1.ServiceQueryDto, String, Object]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get service statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Service statistics retrieved successfully" }),
    __param(0, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "getStats", null);
__decorate([
    (0, common_1.Post)("bundles"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new service bundle" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_bundle_schema_1.ServiceBundle, 201, "Service bundle created successfully"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, auth_1.BusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_bundle_dto_1.CreateServiceBundleDto, String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "createBundle", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)("bundles"),
    (0, swagger_1.ApiOperation)({ summary: "Get all service bundles (Public with subdomain or authenticated)" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_bundle_schema_1.ServiceBundle),
    __param(0, (0, common_1.Query)('subdomain')),
    __param(1, (0, auth_1.OptionalBusinessId)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findAllBundles", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)('bundles/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a service bundle by ID (Public)' }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_bundle_schema_1.ServiceBundle),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findOneBundle", null);
__decorate([
    (0, common_1.Patch)("bundles/:id"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Update a service bundle" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_bundle_schema_1.ServiceBundle),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_bundle_dto_1.UpdateServiceBundleDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "updateBundle", null);
__decorate([
    (0, auth_1.Public)(),
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a service by ID (Public)' }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_schema_1.Service),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Update a service" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_schema_1.Service),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_dto_1.UpdateServiceDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/variants"),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Add a variant to a service" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_schema_1.Service),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, service_variant_dto_1.CreateServiceVariantDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "addVariant", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service deactivated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "remove", null);
ServiceController = __decorate([
    (0, common_1.Controller)("services"),
    __metadata("design:paramtypes", [service_service_1.ServiceService])
], ServiceController);
exports.ServiceController = ServiceController;
//# sourceMappingURL=service.controller.js.map