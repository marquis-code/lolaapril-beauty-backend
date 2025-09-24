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
const service_category_schema_1 = require("./schemas/service-category.schema");
const service_schema_1 = require("./schemas/service.schema");
const service_bundle_schema_1 = require("./schemas/service-bundle.schema");
const api_response_decorator_1 = require("../common/decorators/api-response.decorator");
let ServiceController = class ServiceController {
    constructor(serviceService) {
        this.serviceService = serviceService;
    }
    createCategory(createCategoryDto) {
        return this.serviceService.createCategory(createCategoryDto);
    }
    findAllCategories() {
        return this.serviceService.findAllCategories();
    }
    updateCategory(id, updateCategoryDto) {
        return this.serviceService.updateCategory(id, updateCategoryDto);
    }
    create(createServiceDto) {
        return this.serviceService.createService(createServiceDto);
    }
    findAll(query) {
        return this.serviceService.findAllServices(query);
    }
    getStats() {
        return this.serviceService.getServiceStats();
    }
    findOne(id) {
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
    createBundle(createBundleDto) {
        return this.serviceService.createBundle(createBundleDto);
    }
    findAllBundles() {
        return this.serviceService.findAllBundles();
    }
    findOneBundle(id) {
        return this.serviceService.findOneBundle(id);
    }
    updateBundle(id, updateBundleDto) {
        return this.serviceService.updateBundle(id, updateBundleDto);
    }
};
__decorate([
    (0, common_1.Post)("categories"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new service category" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_category_schema_1.ServiceCategory, 201, "Service category created successfully"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_category_dto_1.CreateServiceCategoryDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "createCategory", null);
__decorate([
    (0, common_1.Get)("categories"),
    (0, swagger_1.ApiOperation)({ summary: "Get all service categories" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_category_schema_1.ServiceCategory),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findAllCategories", null);
__decorate([
    (0, common_1.Patch)("categories/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a service category" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_category_schema_1.ServiceCategory),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_category_dto_1.UpdateServiceCategoryDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "updateCategory", null);
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new service" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_schema_1.Service, 201, "Service created successfully"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_dto_1.CreateServiceDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all services with filtering and pagination" }),
    (0, api_response_decorator_1.ApiPaginatedResponse)(service_schema_1.Service),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [service_query_dto_1.ServiceQueryDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, swagger_1.ApiOperation)({ summary: "Get service statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Service statistics retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a service by ID' }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_schema_1.Service),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a service" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_schema_1.Service),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_dto_1.UpdateServiceDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(":id/variants"),
    (0, swagger_1.ApiOperation)({ summary: "Add a variant to a service" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_schema_1.Service),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, service_variant_dto_1.CreateServiceVariantDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "addVariant", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, swagger_1.ApiOperation)({ summary: 'Deactivate a service' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Service deactivated successfully' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)("bundles"),
    (0, swagger_1.ApiOperation)({ summary: "Create a new service bundle" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_bundle_schema_1.ServiceBundle, 201, "Service bundle created successfully"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_service_bundle_dto_1.CreateServiceBundleDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "createBundle", null);
__decorate([
    (0, common_1.Get)("bundles"),
    (0, swagger_1.ApiOperation)({ summary: "Get all service bundles" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_bundle_schema_1.ServiceBundle),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findAllBundles", null);
__decorate([
    (0, common_1.Get)('bundles/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a service bundle by ID' }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_bundle_schema_1.ServiceBundle),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "findOneBundle", null);
__decorate([
    (0, common_1.Patch)("bundles/:id"),
    (0, swagger_1.ApiOperation)({ summary: "Update a service bundle" }),
    (0, api_response_decorator_1.ApiResponseWrapper)(service_bundle_schema_1.ServiceBundle),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_service_bundle_dto_1.UpdateServiceBundleDto]),
    __metadata("design:returntype", void 0)
], ServiceController.prototype, "updateBundle", null);
ServiceController = __decorate([
    (0, swagger_1.ApiTags)("Services"),
    (0, common_1.Controller)("services"),
    __metadata("design:paramtypes", [service_service_1.ServiceService])
], ServiceController);
exports.ServiceController = ServiceController;
//# sourceMappingURL=service.controller.js.map