import { Controller, Get, Post, Patch, Param, Delete } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import type { ServiceService } from "./service.service"
import type { CreateServiceCategoryDto } from "./dto/create-service-category.dto"
import type { CreateServiceDto } from "./dto/create-service.dto"
import type { CreateServiceBundleDto } from "./dto/create-service-bundle.dto"
import type { CreateServiceVariantDto } from "./dto/service-variant.dto"
import type { UpdateServiceCategoryDto } from "./dto/update-service-category.dto"
import type { UpdateServiceDto } from "./dto/update-service.dto"
import type { UpdateServiceBundleDto } from "./dto/update-service-bundle.dto"
import type { ServiceQueryDto } from "./dto/service-query.dto"
import { ServiceCategory } from "./schemas/service-category.schema"
import { Service } from "./schemas/service.schema"
import { ServiceBundle } from "./schemas/service-bundle.schema"
import { ApiResponseWrapper, ApiPaginatedResponse } from "../common/decorators/api-response.decorator"

@ApiTags("Services")
@Controller("services")
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // Service Categories
  @Post("categories")
  @ApiOperation({ summary: "Create a new service category" })
  @ApiResponseWrapper(ServiceCategory, 201, "Service category created successfully")
  createCategory(createCategoryDto: CreateServiceCategoryDto) {
    return this.serviceService.createCategory(createCategoryDto)
  }

  @Get("categories")
  @ApiOperation({ summary: "Get all service categories" })
  @ApiResponseWrapper(ServiceCategory)
  findAllCategories() {
    return this.serviceService.findAllCategories()
  }

  @Patch("categories/:id")
  @ApiOperation({ summary: "Update a service category" })
  @ApiResponseWrapper(ServiceCategory)
  updateCategory(@Param('id') id: string, updateCategoryDto: UpdateServiceCategoryDto) {
    return this.serviceService.updateCategory(id, updateCategoryDto)
  }

  // Services
  @Post()
  @ApiOperation({ summary: "Create a new service" })
  @ApiResponseWrapper(Service, 201, "Service created successfully")
  create(createServiceDto: CreateServiceDto) {
    return this.serviceService.createService(createServiceDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all services with filtering and pagination" })
  @ApiPaginatedResponse(Service)
  findAll(query: ServiceQueryDto) {
    return this.serviceService.findAllServices(query)
  }

  @Get("stats")
  @ApiOperation({ summary: "Get service statistics" })
  @ApiResponse({ status: 200, description: "Service statistics retrieved successfully" })
  getStats() {
    return this.serviceService.getServiceStats()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID' })
  @ApiResponseWrapper(Service)
  findOne(@Param('id') id: string) {
    return this.serviceService.findOneService(id);
  }

  @Patch(":id")
  @ApiOperation({ summary: "Update a service" })
  @ApiResponseWrapper(Service)
  update(@Param('id') id: string, updateServiceDto: UpdateServiceDto) {
    return this.serviceService.updateService(id, updateServiceDto)
  }

  @Post(":id/variants")
  @ApiOperation({ summary: "Add a variant to a service" })
  @ApiResponseWrapper(Service)
  addVariant(@Param('id') id: string, variantDto: CreateServiceVariantDto) {
    return this.serviceService.addServiceVariant(id, variantDto)
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Deactivate a service' })
  @ApiResponse({ status: 200, description: 'Service deactivated successfully' })
  remove(@Param('id') id: string) {
    return this.serviceService.removeService(id);
  }

  // Service Bundles
  @Post("bundles")
  @ApiOperation({ summary: "Create a new service bundle" })
  @ApiResponseWrapper(ServiceBundle, 201, "Service bundle created successfully")
  createBundle(createBundleDto: CreateServiceBundleDto) {
    return this.serviceService.createBundle(createBundleDto)
  }

  @Get("bundles")
  @ApiOperation({ summary: "Get all service bundles" })
  @ApiResponseWrapper(ServiceBundle)
  findAllBundles() {
    return this.serviceService.findAllBundles()
  }

  @Get('bundles/:id')
  @ApiOperation({ summary: 'Get a service bundle by ID' })
  @ApiResponseWrapper(ServiceBundle)
  findOneBundle(@Param('id') id: string) {
    return this.serviceService.findOneBundle(id);
  }

  @Patch("bundles/:id")
  @ApiOperation({ summary: "Update a service bundle" })
  @ApiResponseWrapper(ServiceBundle)
  updateBundle(@Param('id') id: string, updateBundleDto: UpdateServiceBundleDto) {
    return this.serviceService.updateBundle(id, updateBundleDto)
  }
}
