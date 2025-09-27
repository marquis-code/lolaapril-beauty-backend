// src/modules/availability/controllers/availability.controller.ts
import { Controller, Get, Post, Body, Query, UseGuards, ValidationPipe } from '@nestjs/common'
import { AvailabilityService } from '../availability/availability.service'
import { CreateStaffAvailabilityDto } from '../availability/dto/create-staff-availability.dto'
import { CheckAvailabilityDto } from '../availability/dto/check-availability.dto'
import { GetAvailableSlotsDto } from '../availability/dto/get-available-slots.dto'
import { BlockStaffTimeDto } from '../availability/dto/block-staff-time.dto'
import { TenantGuard } from '../tenant/guards/tenant.guard'

@Controller('availability')
@UseGuards(TenantGuard)
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get('slots')
  async getAvailableSlots(@Query(ValidationPipe) dto: GetAvailableSlotsDto) {
    return {
      success: true,
      data: await this.availabilityService.getAvailableSlots(dto)
    }
  }

  @Get('check')
  async checkSlotAvailability(@Query(ValidationPipe) dto: CheckAvailabilityDto) {
    return {
      success: true,
      data: {
        isAvailable: await this.availabilityService.checkSlotAvailability(dto)
      }
    }
  }

  @Post('staff')
  async createStaffAvailability(@Body(ValidationPipe) dto: CreateStaffAvailabilityDto) {
    return {
      success: true,
      data: await this.availabilityService.createStaffAvailability(dto),
      message: 'Staff availability created successfully'
    }
  }

  @Post('staff/block')
  async blockStaffTime(@Body(ValidationPipe) dto: BlockStaffTimeDto) {
    await this.availabilityService.blockStaffTime(dto)
    return {
      success: true,
      message: 'Staff time blocked successfully'
    }
  }
}