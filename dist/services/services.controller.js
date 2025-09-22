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
exports.ServicesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const user_schema_1 = require("../schemas/user.schema");
const service_schema_1 = require("../schemas/service.schema");
let ServicesController = class ServicesController {
    constructor(servicesService) {
        this.servicesService = servicesService;
    }
    create(createServiceDto) {
        return this.servicesService.create(createServiceDto);
    }
    findAll(filterDto) {
        return this.servicesService.findAll(filterDto);
    }
    getCategories() {
        return this.servicesService.getServiceCategories();
    }
    getPopular(limit) {
        return this.servicesService.findPopular(limit);
    }
    getStats() {
        return this.servicesService.getServiceStats();
    }
    findByCategory(category) {
        return this.servicesService.findByCategory(category);
    }
    findOne(id) {
        return this.servicesService.findOne(id);
    }
    update(id, updateServiceDto) {
        return this.servicesService.update(id, updateServiceDto);
    }
    toggleActive(id) {
        return this.servicesService.toggleActive(id);
    }
    remove(id) {
        return this.servicesService.remove(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Create a new service" }),
    (0, swagger_1.ApiResponse)({ status: 201, description: "Service created successfully" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden - Admin access required" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: "Get all services with optional filtering" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Services retrieved successfully" }),
    (0, swagger_1.ApiQuery)({ name: "category", required: false, enum: service_schema_1.ServiceCategory }),
    (0, swagger_1.ApiQuery)({ name: "isActive", required: false, type: Boolean }),
    (0, swagger_1.ApiQuery)({ name: "minPrice", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "maxPrice", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "minDuration", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "maxDuration", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "search", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "sortBy", required: false, type: String }),
    (0, swagger_1.ApiQuery)({ name: "sortOrder", required: false, enum: ["asc", "desc"] }),
    (0, swagger_1.ApiQuery)({ name: "page", required: false, type: Number }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Function]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)("categories"),
    (0, swagger_1.ApiOperation)({ summary: "Get all service categories" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Categories retrieved successfully" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "getCategories", null);
__decorate([
    (0, common_1.Get)("popular"),
    (0, swagger_1.ApiOperation)({ summary: "Get popular services" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Popular services retrieved successfully" }),
    (0, swagger_1.ApiQuery)({ name: "limit", required: false, type: Number }),
    __param(0, (0, common_1.Query)("limit")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "getPopular", null);
__decorate([
    (0, common_1.Get)("stats"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Get service statistics" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Statistics retrieved successfully" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden - Admin access required" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)("category/:category"),
    (0, swagger_1.ApiOperation)({ summary: "Get services by category" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Services retrieved successfully" }),
    __param(0, (0, common_1.Param)("category")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "findByCategory", null);
__decorate([
    (0, common_1.Get)(":id"),
    (0, swagger_1.ApiOperation)({ summary: "Get a service by ID" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Service retrieved successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Service not found" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Update a service" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Service updated successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Service not found" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden - Admin access required" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Function]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(":id/toggle-active"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Toggle service active status" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Service status toggled successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Service not found" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden - Admin access required" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "toggleActive", null);
__decorate([
    (0, common_1.Delete)(":id"),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_schema_1.UserRole.ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    (0, swagger_1.ApiOperation)({ summary: "Delete a service" }),
    (0, swagger_1.ApiResponse)({ status: 200, description: "Service deleted successfully" }),
    (0, swagger_1.ApiResponse)({ status: 404, description: "Service not found" }),
    (0, swagger_1.ApiResponse)({ status: 403, description: "Forbidden - Admin access required" }),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ServicesController.prototype, "remove", null);
ServicesController = __decorate([
    (0, swagger_1.ApiTags)("Services"),
    (0, common_1.Controller)("services"),
    __metadata("design:paramtypes", [Function])
], ServicesController);
exports.ServicesController = ServicesController;
//# sourceMappingURL=services.controller.js.map