import { Controller, Query, Get, Post, Patch, Param, Delete, Body } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
import { ServiceService } from "./service.service"
import { CreateServiceCategoryDto } from "./dto/create-service-category.dto"
import { CreateServiceDto } from "./dto/create-service.dto"
import { CreateServiceBundleDto } from "./dto/create-service-bundle.dto"
import { CreateServiceVariantDto } from "./dto/service-variant.dto"
import { UpdateServiceCategoryDto } from "./dto/update-service-category.dto"
import { UpdateServiceDto } from "./dto/update-service.dto"
import { UpdateServiceBundleDto } from "./dto/update-service-bundle.dto"
import { ServiceQueryDto } from "./dto/service-query.dto"
import { ServiceCategory } from "./schemas/service-category.schema"
import { Service } from "./schemas/service.schema"
import { ServiceBundle } from "./schemas/service-bundle.schema"
import { ApiResponseWrapper, ApiPaginatedResponse } from "../common/decorators/api-response.decorator"

// @ApiTags("Services")
@Controller("services")
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // Service Categories
  @Post("categories")
  @ApiOperation({ summary: "Create a new service category" })
  @ApiResponseWrapper(ServiceCategory, 201, "Service category created successfully")
  createCategory(@Body() createCategoryDto: CreateServiceCategoryDto) {
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
  updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateServiceCategoryDto) {
    return this.serviceService.updateCategory(id, updateCategoryDto)
  }

  // Services
  @Post()
  @ApiOperation({ summary: "Create a new service" })
  @ApiResponseWrapper(Service, 201, "Service created successfully")
  create(@Body() createServiceDto: CreateServiceDto) {
    return this.serviceService.createService(createServiceDto)
  }

  @Get()
  @ApiOperation({ summary: "Get all services with filtering and pagination" })
  @ApiPaginatedResponse(Service)
  findAll(@Query() query: ServiceQueryDto) {
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
  update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
    return this.serviceService.updateService(id, updateServiceDto)
  }

  @Post(":id/variants")
  @ApiOperation({ summary: "Add a variant to a service" })
  @ApiResponseWrapper(Service)
  addVariant(@Param('id') id: string, @Body() variantDto: CreateServiceVariantDto) {
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
  createBundle(@Body()createBundleDto: CreateServiceBundleDto) {
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
  updateBundle(@Param('id') id: string, @Body() updateBundleDto: UpdateServiceBundleDto) {
    return this.serviceService.updateBundle(id, updateBundleDto)
  }
}
