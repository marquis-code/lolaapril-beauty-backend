// // src/modules/availability/controllers/availability.controller.ts
// // src/modules/availability/controllers/availability.controller.ts
// import { Controller, Get, Post, Body, Query, UseGuards, ValidationPipe, Req, BadRequestException } from '@nestjs/common'
// import { AvailabilityService } from './availability.service'
// import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto'
// import { CheckAvailabilityDto } from './dto/check-availability.dto'
// import { GetAvailableSlotsDto } from './dto/get-available-slots.dto'
// import { BlockStaffTimeDto } from './dto/block-staff-time.dto'
// import { TenantGuard } from '../tenant/guards/tenant.guard'
// import { TenantRequest } from '../tenant/middleware/tenant.middleware'
// import { GetAllSlotsDto } from "./dto/get-all-slots.dto"

// @Controller('availability')
// @UseGuards(TenantGuard)
// export class AvailabilityController {
//   constructor(private readonly availabilityService: AvailabilityService) {}

//   @Get('slots')
//   async getAvailableSlots(
//     @Query(ValidationPipe) dto: GetAvailableSlotsDto,
//     @Req() req: TenantRequest
//   ) {
//     // Inject businessId from tenant context
//     dto.businessId = dto.businessId || req.tenant?.businessId
    
//     if (!dto.businessId) {
//       throw new BadRequestException('Business ID is required')
//     }
    
//     return {
//       success: true,
//       data: await this.availabilityService.getAvailableSlots(dto)
//     }
//   }

//   @Get('check')
//   async checkSlotAvailability(
//     @Query(ValidationPipe) dto: CheckAvailabilityDto,
//     @Req() req: TenantRequest
//   ) {
//     dto.businessId = dto.businessId || req.tenant?.businessId
    
//     if (!dto.businessId) {
//       throw new BadRequestException('Business ID is required')
//     }
    
//     return {
//       success: true,
//       data: {
//         isAvailable: await this.availabilityService.checkSlotAvailability(dto)
//       }
//     }
//   }

//   @Post('staff')
//   async createStaffAvailability(
//     @Body(ValidationPipe) dto: CreateStaffAvailabilityDto,
//     @Req() req: TenantRequest
//   ) {
//     dto.businessId = dto.businessId || req.tenant?.businessId
    
//     if (!dto.businessId) {
//       throw new BadRequestException('Business ID is required')
//     }
    
//     return {
//       success: true,
//       data: await this.availabilityService.createStaffAvailability(dto),
//       message: 'Staff availability created successfully'
//     }
//   }

//   @Post('staff/block')
//   async blockStaffTime(
//     @Body(ValidationPipe) dto: BlockStaffTimeDto,
//     @Req() req: TenantRequest
//   ) {
//     // Ensure businessId is set from tenant context or request body
//     dto.businessId = dto.businessId || req.tenant?.businessId
    
//     if (!dto.businessId) {
//       throw new BadRequestException('Business ID is required. Please provide businessId in the request body or ensure tenant context is set.')
//     }
    
//     await this.availabilityService.blockStaffTime(dto)
//     return {
//       success: true,
//       message: 'Staff time blocked successfully'
//     }
//   }
// @Get('all-slots')
// async getAllSlots(
//   @Query(ValidationPipe) dto: GetAllSlotsDto,
//   @Req() req: TenantRequest
// ) {
//   // Inject businessId from tenant context
//   dto.businessId = dto.businessId || req.tenant?.businessId
  
//   if (!dto.businessId) {
//     throw new BadRequestException('Business ID is required')
//   }
  
//   return {
//     success: true,
//     data: await this.availabilityService.getAllSlots(dto)
//   }
// }

// @Post('business-hours')
// async createBusinessHours(@Body('businessId') businessId: string) {
//   return this.availabilityService.createBusinessHours(businessId)
// }

// @Post('setup')
// async setupAvailability(@Body() dto: {
//   businessId: string
//   staffIds: string[]
//   startDate: string
//   endDate: string
//   createdBy: string
// }) {
//   await this.availabilityService.setupAvailabilityForBusiness(
//     dto.businessId,
//     dto.staffIds,
//     dto.startDate,
//     dto.endDate,
//     dto.createdBy
//   )
//   return { message: 'Availability setup completed' }
// }

// @Post('business-hours/24x7')
// async createBusinessHours24x7(@Body('businessId') businessId: string) {
//   return this.availabilityService.createBusinessHours24x7(businessId)
// }

// @Post('check-fully-booked')
// async checkFullyBooked(@Body() dto: {
//   businessId: string
//   date: string
//   startTime: string
//   duration: number
//   bufferTime?: number
// }) {
//   return this.availabilityService.isFullyBooked(dto)
// }

// // Add to availability.controller.ts

// @Post('extend-availability')
// async extendStaffAvailability(
//   @Body() dto: {
//     businessId: string
//     staffId?: string // Optional: specific staff or all
//     daysAhead?: number
//   },
//   @Req() req: TenantRequest
// ) {
//   const businessId = dto.businessId || req.tenant?.businessId
  
//   if (!businessId) {
//     throw new BadRequestException('Business ID is required')
//   }
  
//   if (dto.staffId) {
//     await this.availabilityService.ensureStaffAvailabilityExtended(
//       businessId,
//       dto.staffId,
//       dto.daysAhead || 90
//     )
//   } else {
//     await this.availabilityService.ensureAllStaffAvailability(
//       businessId,
//       dto.daysAhead || 90
//     )
//   }
  
//   return {
//     success: true,
//     message: 'Staff availability extended successfully'
//   }
// }

// @Post('initialize-business')
// async initializeBusiness(
//   @Body() dto: {
//     businessId: string
//     staffIds: string[]
//   }
// ) {
//   // 1. Create 24/7 business hours
//   await this.availabilityService.createBusinessHours24x7(dto.businessId)
  
//   // 2. Create 90 days of availability for each staff
//   for (const staffId of dto.staffIds) {
//     await this.availabilityService.setupStaffAvailability24x7(
//       dto.businessId,
//       staffId,
//       new Date(),
//       new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
//       staffId // or admin ID
//     )
//   }
  
//   return {
//     success: true,
//     message: 'Business initialized with continuous 24/7 availability'
//   }
// }

// }


// src/modules/availability/controllers/availability.controller.ts
import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Query, 
  UseGuards, 
  ValidationPipe,
  BadRequestException 
} from '@nestjs/common'
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger'
import { AvailabilityService } from './availability.service'
import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto'
import { CheckAvailabilityDto } from './dto/check-availability.dto'
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto'
import { BlockStaffTimeDto } from './dto/block-staff-time.dto'
import { GetAllSlotsDto } from "./dto/get-all-slots.dto"

// Import from auth module (which we created earlier)
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { BusinessContext, BusinessId, CurrentUser } from '../auth/decorators/business-context.decorator'
import { BusinessAuthGuard, BusinessRolesGuard, RequireBusinessRoles } from '../auth/guards/business-auth.guard'
import { UserRole } from '../auth/schemas/user.schema'
import type { BusinessContext as BusinessCtx } from '../auth/decorators/business-context.decorator'
import type { RequestWithUser } from '../auth/types/request-with-user.interface'

@ApiTags('Availability')
@Controller('availability')
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  // ==========================================================================
  // PUBLIC ENDPOINTS - For clients booking appointments (no auth required)
  // ==========================================================================

  @Get('slots')
  @ApiOperation({ 
    summary: 'Get available time slots (Public - for booking)',
    description: 'Used by clients to view available appointment slots. Requires businessId in query params.'
  })
  @ApiResponse({ status: 200, description: 'Available slots retrieved successfully' })
  async getAvailableSlots(@Query(ValidationPipe) dto: GetAvailableSlotsDto) {
    // For public booking, businessId MUST be in query params
    if (!dto.businessId) {
      throw new BadRequestException('businessId is required in query parameters')
    }
    
    return {
      success: true,
      data: await this.availabilityService.getAvailableSlots(dto)
    }
  }

  @Get('check')
  @ApiOperation({ 
    summary: 'Check if a time slot is available (Public - for booking)',
    description: 'Used by clients to check if a specific time slot is available'
  })
  @ApiResponse({ status: 200, description: 'Availability checked successfully' })
  async checkSlotAvailability(@Query(ValidationPipe) dto: CheckAvailabilityDto) {
    if (!dto.businessId) {
      throw new BadRequestException('businessId is required in query parameters')
    }
    
    return {
      success: true,
      data: {
        isAvailable: await this.availabilityService.checkSlotAvailability(dto)
      }
    }
  }

  @Get('all-slots')
  @ApiOperation({ 
    summary: 'Get all slots summary (Public - for calendar view)',
    description: 'Returns a summary of available slots for date range'
  })
  @ApiResponse({ status: 200, description: 'Slots summary retrieved successfully' })
  async getAllSlots(@Query(ValidationPipe) dto: GetAllSlotsDto) {
    if (!dto.businessId) {
      throw new BadRequestException('businessId is required in query parameters')
    }
    
    return {
      success: true,
      data: await this.availabilityService.getAllSlots(dto)
    }
  }

  // ==========================================================================
  // BUSINESS STAFF ENDPOINTS - For staff managing their own availability
  // ==========================================================================

  @Post('staff/my-availability')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.STAFF, UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create/Update my availability (Staff)',
    description: 'Staff members can set their own availability. BusinessId comes from JWT.'
  })
  @ApiResponse({ status: 201, description: 'Staff availability created successfully' })
  async createMyAvailability(
    @BusinessContext() context: BusinessCtx,
    @Body(ValidationPipe) dto: Omit<CreateStaffAvailabilityDto, 'businessId' | 'staffId' | 'createdBy'>
  ) {
    // Use businessId and userId from JWT context
    const fullDto: CreateStaffAvailabilityDto = {
      ...dto,
      businessId: context.businessId,
      staffId: context.userId,
      createdBy: context.userId
    }
    
    return {
      success: true,
      data: await this.availabilityService.createStaffAvailability(fullDto),
      message: 'Your availability has been updated successfully'
    }
  }

  @Post('staff/block-time')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.STAFF, UserRole.BUSINESS_ADMIN, UserRole.BUSINESS_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Block time slot (Staff)',
    description: 'Staff can block their own time slots'
  })
  @ApiResponse({ status: 200, description: 'Time blocked successfully' })
  async blockMyTime(
    @BusinessContext() context: BusinessCtx,
    @Body(ValidationPipe) dto: Omit<BlockStaffTimeDto, 'businessId' | 'staffId'>
  ) {
    const fullDto: BlockStaffTimeDto = {
      ...dto,
      businessId: context.businessId,
      staffId: context.userId
    }
    
    await this.availabilityService.blockStaffTime(fullDto)
    return {
      success: true,
      message: 'Time slot blocked successfully'
    }
  }

  // ==========================================================================
  // BUSINESS ADMIN/OWNER ENDPOINTS - For managing business availability
  // ==========================================================================

  @Post('staff/availability')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create staff availability (Admin/Owner)',
    description: 'Business admins/owners can set availability for any staff member'
  })
  @ApiResponse({ status: 201, description: 'Staff availability created successfully' })
  async createStaffAvailability(
    @BusinessContext() context: BusinessCtx,
    @Body(ValidationPipe) dto: Omit<CreateStaffAvailabilityDto, 'businessId' | 'createdBy'>
  ) {
    const fullDto: CreateStaffAvailabilityDto = {
      ...dto,
      businessId: context.businessId,
      createdBy: context.userId
    }
    
    return {
      success: true,
      data: await this.availabilityService.createStaffAvailability(fullDto),
      message: 'Staff availability created successfully'
    }
  }

  @Post('staff/block')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Block staff time (Admin/Owner)',
    description: 'Business admins/owners can block time for any staff member'
  })
  @ApiResponse({ status: 200, description: 'Staff time blocked successfully' })
  async blockStaffTime(
    @BusinessContext() context: BusinessCtx,
    @Body(ValidationPipe) dto: Omit<BlockStaffTimeDto, 'businessId'>
  ) {
    const fullDto: BlockStaffTimeDto = {
      ...dto,
      businessId: context.businessId
    }
    
    await this.availabilityService.blockStaffTime(fullDto)
    return {
      success: true,
      message: 'Staff time blocked successfully'
    }
  }

  @Post('business-hours')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Create business hours (Admin/Owner)',
    description: 'Set up business operating hours'
  })
  @ApiResponse({ status: 201, description: 'Business hours created successfully' })
  async createBusinessHours(@BusinessId() businessId: string) {
    return {
      success: true,
      data: await this.availabilityService.createBusinessHours(businessId),
      message: 'Business hours created successfully'
    }
  }

  @Post('business-hours/24x7')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Enable 24/7 operations (Owner only)',
    description: 'Set business to operate 24/7'
  })
  @ApiResponse({ status: 201, description: '24/7 mode enabled successfully' })
  async createBusinessHours24x7(@BusinessId() businessId: string) {
    return {
      success: true,
      data: await this.availabilityService.createBusinessHours24x7(businessId),
      message: '24/7 operations enabled successfully'
    }
  }

  @Post('extend-availability')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER, UserRole.BUSINESS_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Extend staff availability (Admin/Owner)',
    description: 'Extend availability for staff members into the future'
  })
  @ApiResponse({ status: 200, description: 'Availability extended successfully' })
  async extendStaffAvailability(
    @BusinessContext() context: BusinessCtx,
    @Body() dto: {
      staffId?: string
      daysAhead?: number
    }
  ) {
    if (dto.staffId) {
      await this.availabilityService.ensureStaffAvailabilityExtended(
        context.businessId,
        dto.staffId,
        dto.daysAhead || 90
      )
    } else {
      await this.availabilityService.ensureAllStaffAvailability(
        context.businessId,
        dto.daysAhead || 90
      )
    }
    
    return {
      success: true,
      message: 'Staff availability extended successfully'
    }
  }

  @Post('initialize-business')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.BUSINESS_OWNER)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Initialize business availability (Owner only)',
    description: 'Set up 24/7 availability for all staff members'
  })
  @ApiResponse({ status: 201, description: 'Business initialized successfully' })
  async initializeBusiness(
    @BusinessContext() context: BusinessCtx,
    @Body() dto: {
      staffIds: string[]
    }
  ) {
    // 1. Create 24/7 business hours
    await this.availabilityService.createBusinessHours24x7(context.businessId)
    
    // 2. Create 90 days of availability for each staff
    for (const staffId of dto.staffIds) {
      await this.availabilityService.setupStaffAvailability24x7(
        context.businessId,
        staffId,
        new Date(),
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        context.userId
      )
    }
    
    return {
      success: true,
      message: 'Business initialized with continuous 24/7 availability'
    }
  }

  // ==========================================================================
  // PLATFORM ADMIN ENDPOINTS - For system administrators
  // ==========================================================================

  @Post('admin/setup')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Setup availability for any business (Platform Admin)',
    description: 'Platform admins can set up availability for any business'
  })
  @ApiResponse({ status: 201, description: 'Availability setup completed' })
  async setupAvailability(
    @CurrentUser() user: RequestWithUser['user'],
    @Body() dto: {
      businessId: string
      staffIds: string[]
      startDate: string
      endDate: string
    }
  ) {
    await this.availabilityService.setupAvailabilityForBusiness(
      dto.businessId,
      dto.staffIds,
      dto.startDate,
      dto.endDate,
      user.sub
    )
    return { 
      success: true,
      message: 'Availability setup completed' 
    }
  }

  @Post('admin/check-fully-booked')
  @UseGuards(JwtAuthGuard, BusinessRolesGuard)
  @RequireBusinessRoles(UserRole.SUPER_ADMIN)
  @ApiBearerAuth()
  @ApiOperation({ 
    summary: 'Check if time slot is fully booked (Platform Admin)',
    description: 'Platform admins can check availability for any business'
  })
  @ApiResponse({ status: 200, description: 'Booking status checked' })
  async checkFullyBooked(@Body() dto: {
    businessId: string
    date: string
    startTime: string
    duration: number
    bufferTime?: number
  }) {
    return {
      success: true,
      data: await this.availabilityService.isFullyBooked(dto)
    }
  }

  // ==========================================================================
  // HYBRID ENDPOINTS - Can be called by different user types
  // ==========================================================================

  @Get('slots/detailed')
  @ApiOperation({ 
    summary: 'Get detailed slot information (Authenticated or Public)',
    description: 'Returns detailed availability. If authenticated, uses JWT businessId. Otherwise requires businessId in query.'
  })
  @ApiResponse({ status: 200, description: 'Detailed slots retrieved' })
  async getDetailedSlots(
    @CurrentUser() user: RequestWithUser['user'] | undefined,
    @Query(ValidationPipe) dto: GetAvailableSlotsDto
  ) {
    // If user is authenticated and has businessId in JWT, use it
    const businessId = user?.businessId || dto.businessId
    
    if (!businessId) {
      throw new BadRequestException('businessId is required (either in JWT or query params)')
    }
    
    const slotsDto = { ...dto, businessId }
    
    return {
      success: true,
      data: await this.availabilityService.getAvailableSlots(slotsDto),
      userContext: user ? {
        isAuthenticated: true,
        role: user.role,
        businessId: user.businessId
      } : {
        isAuthenticated: false
      }
    }
  }
}