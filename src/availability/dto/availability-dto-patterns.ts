// src/modules/availability/dto/availability-dto-patterns.ts

/**
 * DTO PATTERNS FOR BUSINESS CONTEXT
 * 
 * This file demonstrates best practices for DTOs when working with
 * business context from JWT vs public endpoints
 */

import { IsString, IsDateString, IsArray, ValidateNested, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional, OmitType } from '@nestjs/swagger'

// =============================================================================
// PATTERN 1: Base DTO (Complete - Used Internally)
// =============================================================================

/**
 * Base DTO with ALL fields including businessId
 * This is used internally in services after businessId is injected
 */
export class CreateStaffAvailabilityDto {
  @ApiProperty({ description: 'Business ID' })
  @IsString()
  businessId: string

  @ApiProperty({ description: 'Staff member ID' })
  @IsString()
  staffId: string

  @ApiProperty({ description: 'Date for availability', example: '2026-01-15' })
  @IsDateString()
  date: string

  @ApiProperty({ 
    description: 'Available time slots',
    type: [Object],
    example: [{ startTime: '09:00', endTime: '17:00', isBreak: false }]
  })
  @IsArray()
  availableSlots: Array<{
    startTime: string
    endTime: string
    isBreak: boolean
  }>

  @ApiProperty({ description: 'User who created this availability' })
  @IsString()
  createdBy: string
}

// =============================================================================
// PATTERN 2: Public API DTO (Includes businessId in request)
// =============================================================================

/**
 * Public API DTO - businessId is REQUIRED in the request
 * Used for endpoints accessible without authentication
 */
export class GetAvailableSlotsPublicDto {
  @ApiProperty({ 
    description: 'Business ID (required for public access)',
    example: '675cfabbb2d65f'
  })
  @IsString()
  businessId: string

  @ApiProperty({ description: 'Date to check availability', example: '2026-01-15' })
  @IsDateString()
  date: string

  @ApiProperty({ 
    description: 'Service IDs to book',
    type: [String],
    example: ['service_123', 'service_456']
  })
  @IsArray()
  @IsString({ each: true })
  serviceIds: string[]

  @ApiPropertyOptional({ description: 'Preferred staff ID' })
  @IsOptional()
  @IsString()
  staffId?: string

  @ApiPropertyOptional({ description: 'Buffer time in minutes', default: 0 })
  @IsOptional()
  bufferTime?: number
}

// =============================================================================
// PATTERN 3: Authenticated User DTO (Excludes businessId)
// =============================================================================

/**
 * Authenticated User DTO - businessId comes from JWT
 * Used for endpoints that require authentication
 * 
 * Use OmitType to exclude fields that come from JWT
 */
export class CreateMyAvailabilityDto extends OmitType(
  CreateStaffAvailabilityDto,
  ['businessId', 'staffId', 'createdBy'] as const
) {
  // Only fields that user provides in request body remain
  // businessId, staffId, and createdBy will be added from JWT in controller
}

// Alternative explicit definition:
export class CreateMyAvailabilityDtoExplicit {
  @ApiProperty({ description: 'Date for availability', example: '2026-01-15' })
  @IsDateString()
  date: string

  @ApiProperty({ 
    description: 'Available time slots',
    type: [Object]
  })
  @IsArray()
  availableSlots: Array<{
    startTime: string
    endTime: string
    isBreak: boolean
  }>
  
  // Note: NO businessId, staffId, or createdBy
  // These come from JWT automatically
}

// =============================================================================
// PATTERN 4: Admin DTO (Partial businessId omission)
// =============================================================================

/**
 * Admin DTO - businessId from JWT, but staffId in request
 * Admin can modify any staff member, so staffId comes from request body
 */
export class CreateStaffAvailabilityAdminDto extends OmitType(
  CreateStaffAvailabilityDto,
  ['businessId', 'createdBy'] as const
) {
  // Keeps: staffId, date, availableSlots
  // Omits: businessId (from JWT), createdBy (from JWT)
}

// =============================================================================
// USAGE IN CONTROLLER
// =============================================================================

/**
 * Example controller showing how to use these DTOs
 */
/*
import { Controller, Post, Body, UseGuards } from '@nestjs/common'
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard'
import { BusinessContext, BusinessRolesGuard, RequireBusinessRoles } from '../../auth'
import type { BusinessContext as BusinessCtx } from '../../auth'
import { UserRole } from '../../auth/schemas/user.schema'

@Controller('availability')
export class AvailabilityController {
  
  // PUBLIC ENDPOINT - Full DTO with businessId
  @Post('public/slots')
  async getPublicSlots(
    @Body() dto: GetAvailableSlotsPublicDto
  ) {
    // dto.businessId is provided by user
    // Validate that business exists
    return this.service.getAvailableSlots(dto)
  }
  
  // STAFF ENDPOINT - Omitted fields come from JWT
  @Post('my-availability')
  
  @RequireBusinessRoles(UserRole.STAFF)
  async createMyAvailability(
    @BusinessContext() context: BusinessCtx,
    @Body() dto: CreateMyAvailabilityDto
  ) {
    // Build complete DTO with JWT data
    const completeDto: CreateStaffAvailabilityDto = {
      ...dto,
      businessId: context.businessId,  // From JWT
      staffId: context.userId,         // From JWT
      createdBy: context.userId        // From JWT
    }
    
    return this.service.createStaffAvailability(completeDto)
  }
  
  // ADMIN ENDPOINT - businessId from JWT, staffId from body
  @Post('staff-availability')
  
  
  async createStaffAvailability(
    @BusinessContext() context: BusinessCtx,
    @Body() dto: CreateStaffAvailabilityAdminDto
  ) {
    // Build complete DTO
    const completeDto: CreateStaffAvailabilityDto = {
      ...dto,
      businessId: context.businessId,  // From JWT
      createdBy: context.userId        // From JWT
      // staffId comes from dto (admin can specify any staff)
    }
    
    // Optional: Verify staffId belongs to this business
    await this.verifyStaffBelongsToBusiness(dto.staffId, context.businessId)
    
    return this.service.createStaffAvailability(completeDto)
  }
}
*/

// =============================================================================
// PATTERN 5: Type-safe Controller Parameters
// =============================================================================

/**
 * Helper type for controller methods that merge DTO with JWT context
 */
export type WithBusinessContext<T> = Omit<T, 'businessId' | 'createdBy'> & {
  // Fields from JWT are automatically added in controller
}

/**
 * Type for complete internal DTOs after JWT fields are added
 */
export type CompleteDto<T extends Record<string, any>> = T & {
  businessId: string
  createdBy: string
}

// Usage example:
/*
@Post('create')
async createSomething(
  @BusinessContext() context: BusinessCtx,
  @Body() dto: WithBusinessContext<CreateSomethingDto>
): Promise<CompleteDto<CreateSomethingDto>> {
  const completeDto: CompleteDto<CreateSomethingDto> = {
    ...dto,
    businessId: context.businessId,
    createdBy: context.userId
  }
  
  return this.service.create(completeDto)
}
*/

// =============================================================================
// PATTERN 6: Query vs Body DTOs
// =============================================================================

/**
 * For GET requests, parameters usually come from @Query()
 * businessId should be optional for authenticated users
 */
export class GetAvailabilitySlotsQueryDto {
  @ApiPropertyOptional({ 
    description: 'Business ID (required for public access, optional if authenticated)'
  })
  @IsOptional()
  @IsString()
  businessId?: string

  @ApiProperty({ example: '2026-01-15' })
  @IsDateString()
  date: string

  @ApiProperty({ type: [String] })
  @IsArray()
  @IsString({ each: true })
  serviceIds: string[]
}

// Controller usage:
/*
@Get('slots')
@UseGuards(OptionalAuthGuard)
async getSlots(
  @CurrentUser() user: RequestWithUser['user'] | undefined,
  @Query() dto: GetAvailabilitySlotsQueryDto
) {
  // Priority: JWT businessId > Query businessId
  const businessId = user?.businessId || dto.businessId
  
  if (!businessId) {
    throw new BadRequestException('businessId required')
  }
  
  return this.service.getAvailableSlots({
    ...dto,
    businessId
  })
}
*/

// =============================================================================
// BEST PRACTICES SUMMARY
// =============================================================================

/**
 * 1. PUBLIC ENDPOINTS:
 *    - Include businessId in DTO
 *    - Validate businessId exists
 *    - Example: GetAvailableSlotsPublicDto
 * 
 * 2. AUTHENTICATED ENDPOINTS (Staff):
 *    - Omit businessId, staffId, createdBy from DTO
 *    - Use OmitType or explicit definition
 *    - Extract all from JWT using @BusinessContext()
 *    - Example: CreateMyAvailabilityDto
 * 
 * 3. AUTHENTICATED ENDPOINTS (Admin):
 *    - Omit businessId, createdBy from DTO
 *    - Keep staffId (admin can modify any staff)
 *    - Extract businessId and createdBy from JWT
 *    - Example: CreateStaffAvailabilityAdminDto
 * 
 * 4. PLATFORM ADMIN ENDPOINTS:
 *    - Include ALL fields in DTO
 *    - Admin can work with any business
 *    - Validate admin role
 *    - Example: Full CreateStaffAvailabilityDto
 * 
 * 5. HYBRID ENDPOINTS:
 *    - Make businessId optional
 *    - Check JWT first, fall back to query/body
 *    - Use OptionalAuthGuard
 *    - Example: GetAvailabilitySlotsQueryDto
 */

// =============================================================================
// TYPESCRIPT UTILITY TYPES
// =============================================================================

/**
 * Utility type to remove JWT-provided fields from a DTO
 */
export type RemoveJwtFields<T> = Omit<T, 'businessId' | 'createdBy' | 'updatedBy'>

/**
 * Utility type to add JWT fields to a DTO
 */
export type AddJwtFields<T> = T & {
  businessId: string
  createdBy: string
  updatedBy?: string
}

/**
 * Example usage:
 * 
 * // Define base DTO
 * interface CreateTaskDto {
 *   businessId: string
 *   title: string
 *   description: string
 *   createdBy: string
 * }
 * 
 * // For authenticated endpoints
 * type CreateTaskRequestDto = RemoveJwtFields<CreateTaskDto>
 * // Result: { title: string, description: string }
 * 
 * // In controller
 * const completeDto: CreateTaskDto = {
 *   ...requestDto,
 *   businessId: context.businessId,
 *   createdBy: context.userId
 * }
 */

export default {
  CreateStaffAvailabilityDto,
  GetAvailableSlotsPublicDto,
  CreateMyAvailabilityDto,
  CreateStaffAvailabilityAdminDto,
  GetAvailabilitySlotsQueryDto,
}