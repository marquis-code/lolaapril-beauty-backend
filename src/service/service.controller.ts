import { Controller, Query, Get, Post, Patch, Param, Delete, Body, Req } from "@nestjs/common"
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
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
import { Public, BusinessId, OptionalBusinessId, CurrentUser } from "../auth"
import { RequestWithUser } from "../auth/types/request-with-user.interface"

@Controller("services")
export class ServiceController {
  constructor(private readonly serviceService: ServiceService) {}

  // ==================== SERVICE CATEGORIES ====================
  
  @Post("categories")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new service category" })
  @ApiResponseWrapper(ServiceCategory, 201, "Service category created successfully")
  createCategory(
    @Body() createCategoryDto: CreateServiceCategoryDto,
    @BusinessId() businessId: string  // Changed from @OptionalBusinessId() to @BusinessId()
  ) {
    console.log('📝 Create Category Request:')
    console.log('  - businessId:', businessId)
    console.log('  - categoryData:', createCategoryDto)
    return this.serviceService.createCategory(createCategoryDto, businessId)
  }

  @Get("categories")
  @ApiBearerAuth()  // Added ApiBearerAuth since this requires authentication
  @ApiOperation({ summary: "Get all service categories (Public with subdomain or authenticated)" })
  @ApiResponseWrapper(ServiceCategory)
  findAllCategories(
    @Query('subdomain') subdomain?: string,
    @OptionalBusinessId() businessId?: string,
    @Req() req?: RequestWithUser
  ) {
    console.log('📂 Categories Request DEBUG:')
    console.log('  - subdomain param:', subdomain)
    console.log('  - businessId from decorator:', businessId)
    console.log('  - req.user:', req?.user)
    console.log('  - req.headers.authorization:', req?.headers?.authorization ? '✅ Present' : '❌ Missing')
    
    return this.serviceService.findAllCategories(subdomain, businessId)
  }

  @Patch("categories/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a service category" })
  @ApiResponseWrapper(ServiceCategory)
  updateCategory(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateServiceCategoryDto
  ) {
    return this.serviceService.updateCategory(id, updateCategoryDto)
  }

  // ==================== SERVICES ====================
  
  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new service" })
  @ApiResponseWrapper(Service, 201, "Service created successfully")
  create(
    @Body() createServiceDto: CreateServiceDto,
    @BusinessId() businessId: string  // Changed from @OptionalBusinessId() to @BusinessId()
  ) {
    console.log('📝 Create Service Request:')
    console.log('  - businessId:', businessId)
    console.log('  - serviceData:', createServiceDto)
    return this.serviceService.createService(createServiceDto, businessId)
  }

  @Get()
  @ApiBearerAuth()  // Added ApiBearerAuth
  @ApiOperation({ summary: "Get all services with filtering and pagination (Public with subdomain or authenticated)" })
  @ApiPaginatedResponse(Service)
  findAll(
    @Query() query: ServiceQueryDto,
    @OptionalBusinessId() businessId?: string,
    @Req() req?: RequestWithUser
  ) {
    console.log('🔍 Services Request DEBUG:')
    console.log('  - subdomain param:', query.subdomain)
    console.log('  - businessId from decorator:', businessId)
    console.log('  - req.user exists:', !!req?.user)
    console.log('  - req.user full:', JSON.stringify(req?.user, null, 2))
    console.log('  - Authorization header:', req?.headers?.authorization ? 
      `✅ ${req.headers.authorization.substring(0, 20)}...` : '❌ Missing')
    
    return this.serviceService.findAllServices(query, businessId)
  }

  @Get("stats")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get service statistics" })
  @ApiResponse({ status: 200, description: "Service statistics retrieved successfully" })
  getStats(@BusinessId() businessId: string) {  // Changed from @OptionalBusinessId() to @BusinessId()
    return this.serviceService.getServiceStats(businessId)
  }

  // ==================== SERVICE BUNDLES ====================
  
  @Post("bundles")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new service bundle" })
  @ApiResponseWrapper(ServiceBundle, 201, "Service bundle created successfully")
  createBundle(
    @Body() createBundleDto: CreateServiceBundleDto,
    @BusinessId() businessId: string  // Changed from @OptionalBusinessId() to @BusinessId()
  ) {
    console.log('📦 Create Bundle Request:')
    console.log('  - businessId:', businessId)
    console.log('  - bundleData:', createBundleDto)
    return this.serviceService.createBundle(createBundleDto, businessId)
  }

  @Public()
  @Get("bundles")
  @ApiOperation({ summary: "Get all service bundles (Public with subdomain or authenticated)" })
  @ApiResponseWrapper(ServiceBundle)
  findAllBundles(
    @Query('subdomain') subdomain?: string,
    @OptionalBusinessId() businessId?: string
  ) {
    console.log('📦 Bundles Request:', { subdomain, businessId })
    return this.serviceService.findAllBundles(subdomain, businessId)
  }

  @Public()
  @Get('bundles/:id')
  @ApiOperation({ summary: 'Get a service bundle by ID (Public)' })
  @ApiResponseWrapper(ServiceBundle)
  findOneBundle(@Param('id') id: string) {
    return this.serviceService.findOneBundle(id)
  }

  @Patch("bundles/:id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a service bundle" })
  @ApiResponseWrapper(ServiceBundle)
  updateBundle(
    @Param('id') id: string,
    @Body() updateBundleDto: UpdateServiceBundleDto
  ) {
    return this.serviceService.updateBundle(id, updateBundleDto)
  }

  // ==================== INDIVIDUAL SERVICE ROUTES ====================
  
  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a service by ID (Public)' })
  @ApiResponseWrapper(Service)
  findOne(@Param('id') id: string) {
    console.log('🎯 Service by ID:', id)
    return this.serviceService.findOneService(id)
  }

  @Patch(":id")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Update a service" })
  @ApiResponseWrapper(Service)
  update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto
  ) {
    return this.serviceService.updateService(id, updateServiceDto)
  }

  @Post(":id/variants")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add a variant to a service" })
  @ApiResponseWrapper(Service)
  addVariant(
    @Param('id') id: string,
    @Body() variantDto: CreateServiceVariantDto
  ) {
    return this.serviceService.addServiceVariant(id, variantDto)
  }

  @Delete(':id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Deactivate a service' })
  @ApiResponse({ status: 200, description: 'Service deactivated successfully' })
  remove(@Param('id') id: string) {
    return this.serviceService.removeService(id)
  }
}