// src/modules/availability/controllers/availability.controller.ts
// src/modules/availability/controllers/availability.controller.ts
import { Controller, Get, Post, Body, Query, UseGuards, ValidationPipe, Req, BadRequestException } from '@nestjs/common'
import { AvailabilityService } from './availability.service'
import { CreateStaffAvailabilityDto } from './dto/create-staff-availability.dto'
import { CheckAvailabilityDto } from './dto/check-availability.dto'
import { GetAvailableSlotsDto } from './dto/get-available-slots.dto'
import { BlockStaffTimeDto } from './dto/block-staff-time.dto'
import { TenantGuard } from '../tenant/guards/tenant.guard'
import { TenantRequest } from '../tenant/middleware/tenant.middleware'
import { GetAllSlotsDto } from "./dto/get-all-slots.dto"

@Controller('availability')
@UseGuards(TenantGuard)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('slots')
  async getAvailableSlots(
    @Query(ValidationPipe) dto: GetAvailableSlotsDto,
    @Req() req: TenantRequest
  ) {
    // Inject businessId from tenant context
    dto.businessId = dto.businessId || req.tenant?.businessId
    
    if (!dto.businessId) {
      throw new BadRequestException('Business ID is required')
    }
    
    return {
      success: true,
      data: await this.availabilityService.getAvailableSlots(dto)
    }
  }

  @Get('check')
  async checkSlotAvailability(
    @Query(ValidationPipe) dto: CheckAvailabilityDto,
    @Req() req: TenantRequest
  ) {
    dto.businessId = dto.businessId || req.tenant?.businessId
    
    if (!dto.businessId) {
      throw new BadRequestException('Business ID is required')
    }
    
    return {
      success: true,
      data: {
        isAvailable: await this.availabilityService.checkSlotAvailability(dto)
      }
    }
  }

  @Post('staff')
  async createStaffAvailability(
    @Body(ValidationPipe) dto: CreateStaffAvailabilityDto,
    @Req() req: TenantRequest
  ) {
    dto.businessId = dto.businessId || req.tenant?.businessId
    
    if (!dto.businessId) {
      throw new BadRequestException('Business ID is required')
    }
    
    return {
      success: true,
      data: await this.availabilityService.createStaffAvailability(dto),
      message: 'Staff availability created successfully'
    }
  }

  @Post('staff/block')
  async blockStaffTime(
    @Body(ValidationPipe) dto: BlockStaffTimeDto,
    @Req() req: TenantRequest
  ) {
    // Ensure businessId is set from tenant context or request body
    dto.businessId = dto.businessId || req.tenant?.businessId
    
    if (!dto.businessId) {
      throw new BadRequestException('Business ID is required. Please provide businessId in the request body or ensure tenant context is set.')
    }
    
    await this.availabilityService.blockStaffTime(dto)
    return {
      success: true,
      message: 'Staff time blocked successfully'
    }
  }

  @Get('all-slots')
async getAllSlots(
  @Query(ValidationPipe) dto: GetAllSlotsDto,
  @Req() req: TenantRequest
) {
  // Inject businessId from tenant context
  dto.businessId = dto.businessId || req.tenant?.businessId
  
  if (!dto.businessId) {
    throw new BadRequestException('Business ID is required')
  }
  
  return {
    success: true,
    data: await this.availabilityService.getAllSlots(dto)
  }
}

@Post('business-hours')
async createBusinessHours(@Body('businessId') businessId: string) {
  return this.availabilityService.createBusinessHours(businessId)
}

@Post('setup')
async setupAvailability(@Body() dto: {
  businessId: string
  staffIds: string[]
  startDate: string
  endDate: string
  createdBy: string
}) {
  await this.availabilityService.setupAvailabilityForBusiness(
    dto.businessId,
    dto.staffIds,
    dto.startDate,
    dto.endDate,
    dto.createdBy
  )
  return { message: 'Availability setup completed' }
}

@Post('business-hours/24x7')
async createBusinessHours24x7(@Body('businessId') businessId: string) {
  return this.availabilityService.createBusinessHours24x7(businessId)
}

@Post('check-fully-booked')
async checkFullyBooked(@Body() dto: {
  businessId: string
  date: string
  startTime: string
  duration: number
  bufferTime?: number
}) {
  return this.availabilityService.isFullyBooked(dto)
}

// Add to availability.controller.ts

@Post('extend-availability')
async extendStaffAvailability(
  @Body() dto: {
    businessId: string
    staffId?: string // Optional: specific staff or all
    daysAhead?: number
  },
  @Req() req: TenantRequest
) {
  const businessId = dto.businessId || req.tenant?.businessId
  
  if (!businessId) {
    throw new BadRequestException('Business ID is required')
  }
  
  if (dto.staffId) {
    await this.availabilityService.ensureStaffAvailabilityExtended(
      businessId,
      dto.staffId,
      dto.daysAhead || 90
    )
  } else {
    await this.availabilityService.ensureAllStaffAvailability(
      businessId,
      dto.daysAhead || 90
    )
  }
  
  return {
    success: true,
    message: 'Staff availability extended successfully'
  }
}

@Post('initialize-business')
async initializeBusiness(
  @Body() dto: {
    businessId: string
    staffIds: string[]
  }
) {
  // 1. Create 24/7 business hours
  await this.availabilityService.createBusinessHours24x7(dto.businessId)
  
  // 2. Create 90 days of availability for each staff
  for (const staffId of dto.staffIds) {
    await this.availabilityService.setupStaffAvailability24x7(
      dto.businessId,
      staffId,
      new Date(),
      new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      staffId // or admin ID
    )
  }
  
  return {
    success: true,
    message: 'Business initialized with continuous 24/7 availability'
  }
}

}