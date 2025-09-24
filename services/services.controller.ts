import { Controller, Get, Post, Patch, Param, Delete, Query, UseGuards } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from "@nestjs/swagger"

import type { ServicesService } from "./services.service"
import type { CreateServiceDto } from "./dto/create-service.dto"
import type { UpdateServiceDto } from "./dto/update-service.dto"
import type { ServiceFilterDto } from "./dto/service-filter.dto"
import { JwtAuthGuard } from "../src/auth/guards/jwt-auth.guard"
import { RolesGuard } from "../src/auth/guards/roles.guard"
import { Roles } from "../src/auth/decorators/roles.decorator"
import { UserRole } from "../src/auth/schemas/user.schema"
import { ServiceCategory } from "../schemas/service.schema"

@ApiTags("Services")
@Controller("services")
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new service" })
  @ApiResponse({ status: 201, description: "Service created successfully" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin access required" })
  create(createServiceDto: CreateServiceDto) {
    return this.servicesService.create(createServiceDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all services with optional filtering" })
  @ApiResponse({ status: 200, description: "Services retrieved successfully" })
  @ApiQuery({ name: "category", required: false, enum: ServiceCategory })
  @ApiQuery({ name: "isActive", required: false, type: Boolean })
  @ApiQuery({ name: "minPrice", required: false, type: Number })
  @ApiQuery({ name: "maxPrice", required: false, type: Number })
  @ApiQuery({ name: "minDuration", required: false, type: Number })
  @ApiQuery({ name: "maxDuration", required: false, type: Number })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({ name: "sortBy", required: false, type: String })
  @ApiQuery({ name: "sortOrder", required: false, enum: ["asc", "desc"] })
  @ApiQuery({ name: "page", required: false, type: Number })
  @ApiQuery({ name: "limit", required: false, type: Number })
  findAll(@Query() filterDto: ServiceFilterDto) {
    return this.servicesService.findAll(filterDto)
  }

  @Get("categories")
  @ApiOperation({ summary: "Get all service categories" })
  @ApiResponse({ status: 200, description: "Categories retrieved successfully" })
  getCategories() {
    return this.servicesService.getServiceCategories()
  }

  @Get("popular")
  @ApiOperation({ summary: "Get popular services" })
  @ApiResponse({ status: 200, description: "Popular services retrieved successfully" })
  @ApiQuery({ name: "limit", required: false, type: Number })
  getPopular(@Query("limit") limit?: number) {
    return this.servicesService.findPopular(limit)
  }

  @Get("stats")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get service statistics" })
  @ApiResponse({ status: 200, description: "Statistics retrieved successfully" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin access required" })
  getStats() {
    return this.servicesService.getServiceStats()
  }

  @Get("category/:category")
  @ApiOperation({ summary: "Get services by category" })
  @ApiResponse({ status: 200, description: "Services retrieved successfully" })
  findByCategory(@Param("category") category: ServiceCategory) {
    return this.servicesService.findByCategory(category)
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a service by ID" })
  @ApiResponse({ status: 200, description: "Service retrieved successfully" })
  @ApiResponse({ status: 404, description: "Service not found" })
  findOne(@Param("id") id: string) {
    return this.servicesService.findOne(id)
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a service" })
  @ApiResponse({ status: 200, description: "Service updated successfully" })
  @ApiResponse({ status: 404, description: "Service not found" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin access required" })
  update(@Param("id") id: string, updateServiceDto: UpdateServiceDto) {
    return this.servicesService.update(id, updateServiceDto)
  }

  @Patch(":id/toggle-active")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Toggle service active status" })
  @ApiResponse({ status: 200, description: "Service status toggled successfully" })
  @ApiResponse({ status: 404, description: "Service not found" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin access required" })
  toggleActive(@Param("id") id: string) {
    return this.servicesService.toggleActive(id)
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Delete a service" })
  @ApiResponse({ status: 200, description: "Service deleted successfully" })
  @ApiResponse({ status: 404, description: "Service not found" })
  @ApiResponse({ status: 403, description: "Forbidden - Admin access required" })
  remove(@Param("id") id: string) {
    return this.servicesService.remove(id)
  }
}
