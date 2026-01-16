// import { Controller, Query, Get, Post, Patch, Param, Delete, Body } from "@nestjs/common"
// import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger"
// import { ServiceService } from "./service.service"
// import { CreateServiceCategoryDto } from "./dto/create-service-category.dto"
// import { CreateServiceDto } from "./dto/create-service.dto"
// import { CreateServiceBundleDto } from "./dto/create-service-bundle.dto"
// import { CreateServiceVariantDto } from "./dto/service-variant.dto"
// import { UpdateServiceCategoryDto } from "./dto/update-service-category.dto"
// import { UpdateServiceDto } from "./dto/update-service.dto"
// import { UpdateServiceBundleDto } from "./dto/update-service-bundle.dto"
// import { ServiceQueryDto } from "./dto/service-query.dto"
// import { ServiceCategory } from "./schemas/service-category.schema"
// import { Service } from "./schemas/service.schema"
// import { ServiceBundle } from "./schemas/service-bundle.schema"
// import { ApiResponseWrapper, ApiPaginatedResponse } from "../common/decorators/api-response.decorator"
// import { Public } from "src/auth/decorators/public.decorator"

// // @ApiTags("Services")
// @Controller("services")
// export class ServiceController {
//   constructor(private readonly serviceService: ServiceService) {}

//   // Service Categories
//   @Post("categories")
//   @ApiOperation({ summary: "Create a new service category" })
//   @ApiResponseWrapper(ServiceCategory, 201, "Service category created successfully")
//   createCategory(@Body() createCategoryDto: CreateServiceCategoryDto) {
//     return this.serviceService.createCategory(createCategoryDto)
//   }

//   @Get("categories")
//   @ApiOperation({ summary: "Get all service categories" })
//   @ApiResponseWrapper(ServiceCategory)
//   findAllCategories() {
//     return this.serviceService.findAllCategories()
//   }

//   @Patch("categories/:id")
//   @ApiOperation({ summary: "Update a service category" })
//   @ApiResponseWrapper(ServiceCategory)
//   updateCategory(@Param('id') id: string, @Body() updateCategoryDto: UpdateServiceCategoryDto) {
//     return this.serviceService.updateCategory(id, updateCategoryDto)
//   }

//   // Services
//   @Post()
//   @ApiOperation({ summary: "Create a new service" })
//   @ApiResponseWrapper(Service, 201, "Service created successfully")
//   create(@Body() createServiceDto: CreateServiceDto) {
//     return this.serviceService.createService(createServiceDto)
//   }

//   @Public()
//   @Get()
//   @ApiOperation({ summary: "Get all services with filtering and pagination" })
//   @ApiPaginatedResponse(Service)
//   findAll(@Query() query: ServiceQueryDto) {
//     return this.serviceService.findAllServices(query)
//   }

//   @Get("stats")
//   @ApiOperation({ summary: "Get service statistics" })
//   @ApiResponse({ status: 200, description: "Service statistics retrieved successfully" })
//   getStats() {
//     return this.serviceService.getServiceStats()
//   }

//   // ✅ MOVE ALL BUNDLE ROUTES HERE - BEFORE :id
//   // Service Bundles
//   @Post("bundles")
//   @ApiOperation({ summary: "Create a new service bundle" })
//   @ApiResponseWrapper(ServiceBundle, 201, "Service bundle created successfully")
//   createBundle(@Body() createBundleDto: CreateServiceBundleDto) {
//     return this.serviceService.createBundle(createBundleDto)
//   }

//   @Get("bundles")
//   @ApiOperation({ summary: "Get all service bundles" })
//   @ApiResponseWrapper(ServiceBundle)
//   findAllBundles() {
//     return this.serviceService.findAllBundles()
//   }

//   @Get('bundles/:id')
//   @ApiOperation({ summary: 'Get a service bundle by ID' })
//   @ApiResponseWrapper(ServiceBundle)
//   findOneBundle(@Param('id') id: string) {
//     return this.serviceService.findOneBundle(id);
//   }

//   @Patch("bundles/:id")
//   @ApiOperation({ summary: "Update a service bundle" })
//   @ApiResponseWrapper(ServiceBundle)
//   updateBundle(@Param('id') id: string, @Body() updateBundleDto: UpdateServiceBundleDto) {
//     return this.serviceService.updateBundle(id, updateBundleDto)
//   }

//   // Service routes with :id parameter - THESE GO LAST
//   @Get(':id')
//   @ApiOperation({ summary: 'Get a service by ID' })
//   @ApiResponseWrapper(Service)
//   findOne(@Param('id') id: string) {
//     console.log(id, 'seevice id')
//     return this.serviceService.findOneService(id);
//   }

//   @Patch(":id")
//   @ApiOperation({ summary: "Update a service" })
//   @ApiResponseWrapper(Service)
//   update(@Param('id') id: string, @Body() updateServiceDto: UpdateServiceDto) {
//     return this.serviceService.updateService(id, updateServiceDto)
//   }

//   @Post(":id/variants")
//   @ApiOperation({ summary: "Add a variant to a service" })
//   @ApiResponseWrapper(Service)
//   addVariant(@Param('id') id: string, @Body() variantDto: CreateServiceVariantDto) {
//     return this.serviceService.addServiceVariant(id, variantDto)
//   }

//   @Delete(':id')
//   @ApiOperation({ summary: 'Deactivate a service' })
//   @ApiResponse({ status: 200, description: 'Service deactivated successfully' })
//   remove(@Param('id') id: string) {
//     return this.serviceService.removeService(id);
//   }
// }


// import { Controller, Query, Get, Post, Patch, Param, Delete, Body } from "@nestjs/common"
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
// import { ServiceService } from "./service.service"
// import { CreateServiceCategoryDto } from "./dto/create-service-category.dto"
// import { CreateServiceDto } from "./dto/create-service.dto"
// import { CreateServiceBundleDto } from "./dto/create-service-bundle.dto"
// import { CreateServiceVariantDto } from "./dto/service-variant.dto"
// import { UpdateServiceCategoryDto } from "./dto/update-service-category.dto"
// import { UpdateServiceDto } from "./dto/update-service.dto"
// import { UpdateServiceBundleDto } from "./dto/update-service-bundle.dto"
// import { ServiceQueryDto } from "./dto/service-query.dto"
// import { ServiceCategory } from "./schemas/service-category.schema"
// import { Service } from "./schemas/service.schema"
// import { ServiceBundle } from "./schemas/service-bundle.schema"
// import { ApiResponseWrapper, ApiPaginatedResponse } from "../common/decorators/api-response.decorator"
// import { Public, BusinessId } from "../auth" // Import from your auth module

// // @ApiTags("Services")
// @Controller("services")
// export class ServiceController {
//   constructor(private readonly serviceService: ServiceService) {}

//   // ==================== SERVICE CATEGORIES ====================
  
//   @Post("categories")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Create a new service category" })
//   @ApiResponseWrapper(ServiceCategory, 201, "Service category created successfully")
//   createCategory(
//     @Body() createCategoryDto: CreateServiceCategoryDto,
//     @OptionalBusinessId() businessId?: string businessId: string
//   ) {
//     return this.serviceService.createCategory(createCategoryDto, businessId)
//   }

//   @Public()
//   @Get("categories")
//   @ApiOperation({ summary: "Get all service categories (Public with subdomain or authenticated)" })
//   @ApiResponseWrapper(ServiceCategory)
//   findAllCategories(
//     @Query('subdomain') subdomain?: string,
//     @OptionalBusinessId() businessId?: string businessId?: string  // Will be undefined if not authenticated
//   ) {
//     return this.serviceService.findAllCategories(subdomain, businessId)
//   }

//   @Patch("categories/:id")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Update a service category" })
//   @ApiResponseWrapper(ServiceCategory)
//   updateCategory(
//     @Param('id') id: string,
//     @Body() updateCategoryDto: UpdateServiceCategoryDto
//   ) {
//     return this.serviceService.updateCategory(id, updateCategoryDto)
//   }

//   // ==================== SERVICES ====================
  
//   @Post()
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Create a new service" })
//   @ApiResponseWrapper(Service, 201, "Service created successfully")
//   create(
//     @Body() createServiceDto: CreateServiceDto,
//     @OptionalBusinessId() businessId?: string businessId: string
//   ) {
//     return this.serviceService.createService(createServiceDto, businessId)
//   }

//   @Public()
//   @Get()
//   @ApiOperation({ summary: "Get all services with filtering and pagination (Public with subdomain or authenticated)" })
//   @ApiPaginatedResponse(Service)
//   findAll(
//     @Query() query: ServiceQueryDto,
//     @OptionalBusinessId() businessId?: string businessId?: string
//   ) {
//     return this.serviceService.findAllServices(query, businessId)
//   }

//   @Get("stats")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Get service statistics" })
//   @ApiResponse({ status: 200, description: "Service statistics retrieved successfully" })
//   getStats(@OptionalBusinessId() businessId?: string businessId: string) {
//     return this.serviceService.getServiceStats(businessId)
//   }

//   // ==================== SERVICE BUNDLES ====================
//   // ✅ MOVE ALL BUNDLE ROUTES HERE - BEFORE :id
  
//   @Post("bundles")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Create a new service bundle" })
//   @ApiResponseWrapper(ServiceBundle, 201, "Service bundle created successfully")
//   createBundle(
//     @Body() createBundleDto: CreateServiceBundleDto,
//     @OptionalBusinessId() businessId?: string businessId: string
//   ) {
//     return this.serviceService.createBundle(createBundleDto, businessId)
//   }

//   @Public()
//   @Get("bundles")
//   @ApiOperation({ summary: "Get all service bundles (Public with subdomain or authenticated)" })
//   @ApiResponseWrapper(ServiceBundle)
//   findAllBundles(
//     @Query('subdomain') subdomain?: string,
//     @OptionalBusinessId() businessId?: string businessId?: string  // Will be undefined if not authenticated
//   ) {
//     return this.serviceService.findAllBundles(subdomain, businessId)
//   }

//   @Public()
//   @Get('bundles/:id')
//   @ApiOperation({ summary: 'Get a service bundle by ID (Public)' })
//   @ApiResponseWrapper(ServiceBundle)
//   findOneBundle(@Param('id') id: string) {
//     return this.serviceService.findOneBundle(id)
//   }

//   @Patch("bundles/:id")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Update a service bundle" })
//   @ApiResponseWrapper(ServiceBundle)
//   updateBundle(
//     @Param('id') id: string,
//     @Body() updateBundleDto: UpdateServiceBundleDto
//   ) {
//     return this.serviceService.updateBundle(id, updateBundleDto)
//   }

//   // ==================== INDIVIDUAL SERVICE ROUTES ====================
//   // Service routes with :id parameter - THESE GO LAST
  
//   @Public()
//   @Get(':id')
//   @ApiOperation({ summary: 'Get a service by ID (Public)' })
//   @ApiResponseWrapper(Service)
//   findOne(@Param('id') id: string) {
//     console.log(id, 'service id')
//     return this.serviceService.findOneService(id)
//   }

//   @Patch(":id")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Update a service" })
//   @ApiResponseWrapper(Service)
//   update(
//     @Param('id') id: string,
//     @Body() updateServiceDto: UpdateServiceDto
//   ) {
//     return this.serviceService.updateService(id, updateServiceDto)
//   }

//   @Post(":id/variants")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Add a variant to a service" })
//   @ApiResponseWrapper(Service)
//   addVariant(
//     @Param('id') id: string,
//     @Body() variantDto: CreateServiceVariantDto
//   ) {
//     return this.serviceService.addServiceVariant(id, variantDto)
//   }

//   @Delete(':id')
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Deactivate a service' })
//   @ApiResponse({ status: 200, description: 'Service deactivated successfully' })
//   remove(@Param('id') id: string) {
//     return this.serviceService.removeService(id)
//   }
// }

// import { Controller, Query, Get, Post, Patch, Param, Delete, Body } from "@nestjs/common"
// import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger"
// import { ServiceService } from "./service.service"
// import { CreateServiceCategoryDto } from "./dto/create-service-category.dto"
// import { CreateServiceDto } from "./dto/create-service.dto"
// import { CreateServiceBundleDto } from "./dto/create-service-bundle.dto"
// import { CreateServiceVariantDto } from "./dto/service-variant.dto"
// import { UpdateServiceCategoryDto } from "./dto/update-service-category.dto"
// import { UpdateServiceDto } from "./dto/update-service.dto"
// import { UpdateServiceBundleDto } from "./dto/update-service-bundle.dto"
// import { ServiceQueryDto } from "./dto/service-query.dto"
// import { ServiceCategory } from "./schemas/service-category.schema"
// import { Service } from "./schemas/service.schema"
// import { ServiceBundle } from "./schemas/service-bundle.schema"
// import { ApiResponseWrapper, ApiPaginatedResponse } from "../common/decorators/api-response.decorator"
// import { Public, BusinessId, OptionalBusinessId } from "../auth"

// @Controller("services")
// export class ServiceController {
//   constructor(private readonly serviceService: ServiceService) {}

//   // ==================== SERVICE CATEGORIES ====================
  
//   @Post("categories")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Create a new service category" })
//   @ApiResponseWrapper(ServiceCategory, 201, "Service category created successfully")
//   createCategory(
//     @Body() createCategoryDto: CreateServiceCategoryDto,
//     @OptionalBusinessId() businessId?: string businessId: string // Required for authenticated routes
//   ) {
//     return this.serviceService.createCategory(createCategoryDto, businessId)
//   }

//   @Public()
//   @Get("categories")
//   @ApiOperation({ summary: "Get all service categories (Public with subdomain or authenticated)" })
//   @ApiResponseWrapper(ServiceCategory)
//   findAllCategories(
//     @Query('subdomain') subdomain?: string,
//     @OptionalBusinessId() businessId?: string // Optional - works with or without auth
//   ) {
//     console.log('📂 Categories Request:', { subdomain, businessId })
//     return this.serviceService.findAllCategories(subdomain, businessId)
//   }

//   @Patch("categories/:id")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Update a service category" })
//   @ApiResponseWrapper(ServiceCategory)
//   updateCategory(
//     @Param('id') id: string,
//     @Body() updateCategoryDto: UpdateServiceCategoryDto
//   ) {
//     return this.serviceService.updateCategory(id, updateCategoryDto)
//   }

//   // ==================== SERVICES ====================
  
//   @Post()
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Create a new service" })
//   @ApiResponseWrapper(Service, 201, "Service created successfully")
//   create(
//     @Body() createServiceDto: CreateServiceDto,
//     @OptionalBusinessId() businessId?: string businessId: string // Required for authenticated routes
//   ) {
//     return this.serviceService.createService(createServiceDto, businessId)
//   }

//   @Public()
//   @Get()
//   @ApiOperation({ summary: "Get all services with filtering and pagination (Public with subdomain or authenticated)" })
//   @ApiPaginatedResponse(Service)
//   findAll(
//     @Query() query: ServiceQueryDto,
//     @OptionalBusinessId() businessId?: string // Optional - works with or without auth
//   ) {
//     console.log('🔍 Services Request:', { 
//       subdomain: query.subdomain, 
//       businessId,
//       hasAuth: !!businessId,
//       queryParams: query 
//     })
//     return this.serviceService.findAllServices(query, businessId)
//   }

//   @Get("stats")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Get service statistics" })
//   @ApiResponse({ status: 200, description: "Service statistics retrieved successfully" })
//   getStats(@OptionalBusinessId() businessId?: string businessId: string) { // Required for authenticated routes
//     return this.serviceService.getServiceStats(businessId)
//   }

//   // ==================== SERVICE BUNDLES ====================
  
//   @Post("bundles")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Create a new service bundle" })
//   @ApiResponseWrapper(ServiceBundle, 201, "Service bundle created successfully")
//   createBundle(
//     @Body() createBundleDto: CreateServiceBundleDto,
//     @OptionalBusinessId() businessId?: string businessId: string // Required for authenticated routes
//   ) {
//     return this.serviceService.createBundle(createBundleDto, businessId)
//   }

//   @Public()
//   @Get("bundles")
//   @ApiOperation({ summary: "Get all service bundles (Public with subdomain or authenticated)" })
//   @ApiResponseWrapper(ServiceBundle)
//   findAllBundles(
//     @Query('subdomain') subdomain?: string,
//     @OptionalBusinessId() businessId?: string // Optional - works with or without auth
//   ) {
//     console.log('📦 Bundles Request:', { subdomain, businessId })
//     return this.serviceService.findAllBundles(subdomain, businessId)
//   }

//   @Public()
//   @Get('bundles/:id')
//   @ApiOperation({ summary: 'Get a service bundle by ID (Public)' })
//   @ApiResponseWrapper(ServiceBundle)
//   findOneBundle(@Param('id') id: string) {
//     return this.serviceService.findOneBundle(id)
//   }

//   @Patch("bundles/:id")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Update a service bundle" })
//   @ApiResponseWrapper(ServiceBundle)
//   updateBundle(
//     @Param('id') id: string,
//     @Body() updateBundleDto: UpdateServiceBundleDto
//   ) {
//     return this.serviceService.updateBundle(id, updateBundleDto)
//   }

//   // ==================== INDIVIDUAL SERVICE ROUTES ====================
  
//   @Public()
//   @Get(':id')
//   @ApiOperation({ summary: 'Get a service by ID (Public)' })
//   @ApiResponseWrapper(Service)
//   findOne(@Param('id') id: string) {
//     console.log('🎯 Service by ID:', id)
//     return this.serviceService.findOneService(id)
//   }

//   @Patch(":id")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Update a service" })
//   @ApiResponseWrapper(Service)
//   update(
//     @Param('id') id: string,
//     @Body() updateServiceDto: UpdateServiceDto
//   ) {
//     return this.serviceService.updateService(id, updateServiceDto)
//   }

//   @Post(":id/variants")
//   @ApiBearerAuth()
//   @ApiOperation({ summary: "Add a variant to a service" })
//   @ApiResponseWrapper(Service)
//   addVariant(
//     @Param('id') id: string,
//     @Body() variantDto: CreateServiceVariantDto
//   ) {
//     return this.serviceService.addServiceVariant(id, variantDto)
//   }

//   @Delete(':id')
//   @ApiBearerAuth()
//   @ApiOperation({ summary: 'Deactivate a service' })
//   @ApiResponse({ status: 200, description: 'Service deactivated successfully' })
//   remove(@Param('id') id: string) {
//     return this.serviceService.removeService(id)
//   }
// }


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
    @OptionalBusinessId() businessId?: string
  ) {
    return this.serviceService.createCategory(createCategoryDto, businessId)
  }

  @Public()
  @Get("categories")
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
    @OptionalBusinessId() businessId?: string
  ) {
    return this.serviceService.createService(createServiceDto, businessId)
  }

  // @Public()
  @Get()
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
  getStats(@OptionalBusinessId() businessId?: string) {
    return this.serviceService.getServiceStats(businessId)
  }

  // ==================== SERVICE BUNDLES ====================
  
  @Post("bundles")
  @ApiBearerAuth()
  @ApiOperation({ summary: "Create a new service bundle" })
  @ApiResponseWrapper(ServiceBundle, 201, "Service bundle created successfully")
  createBundle(
    @Body() createBundleDto: CreateServiceBundleDto,
    @OptionalBusinessId() businessId?: string
  ) {
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