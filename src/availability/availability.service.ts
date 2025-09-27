// src/modules/availability/services/availability.service.ts
import { Injectable, BadRequestException, Inject, forwardRef } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model, Types } from 'mongoose'
import { BusinessHours, BusinessHoursDocument, TimeSlot } from '../availability/schemas/business-hours.schema'
import { StaffAvailability, StaffAvailabilityDocument } from '../availability/schemas/staff-availability.schema'
import { CreateStaffAvailabilityDto } from '../availability/dto/create-staff-availability.dto'
import { CheckAvailabilityDto } from '../availability/dto/check-availability.dto'
import { GetAvailableSlotsDto } from '../availability/dto/get-available-slots.dto'
import { BlockStaffTimeDto } from '../availability/dto/block-staff-time.dto'

export interface AvailabilitySlot {
  startTime: string
  endTime: string
  duration: number
  availableStaff: Types.ObjectId[]
  availableResources: Types.ObjectId[]
  isBookable: boolean
}

@Injectable()
export class AvailabilityService {
  constructor(
    @InjectModel(BusinessHours.name)
    private businessHoursModel: Model<BusinessHoursDocument>,
    @InjectModel(StaffAvailability.name)
    private staffAvailabilityModel: Model<StaffAvailabilityDocument>,
  ) {}

  async getAvailableSlots(dto: GetAvailableSlotsDto): Promise<AvailabilitySlot[]> {
    const businessHours = await this.getBusinessHours(dto.businessId, dto.date)
    
    if (!businessHours || businessHours.length === 0) {
      return []
    }

    // Get service details to know required staff/resources
    const service = await this.getServiceDetails(dto.serviceId)
    const requiredStaff = service?.teamMembers?.selectedMembers?.map(m => m.id) || []

    // Get staff availability
    const staffAvailability = await this.getStaffAvailability(
      dto.businessId, 
      requiredStaff, 
      dto.date
    )

    // Generate available slots
    return this.generateAvailableSlots(
      businessHours,
      staffAvailability,
      dto.duration
    )
  }

  async checkSlotAvailability(dto: CheckAvailabilityDto): Promise<boolean> {
    const endTime = this.addMinutesToTime(dto.startTime, dto.duration)
    
    // Check business hours
    const isWithinBusinessHours = await this.isWithinBusinessHours(
      dto.businessId, 
      dto.date, 
      dto.startTime, 
      endTime
    )
    
    if (!isWithinBusinessHours) return false

    // Check staff availability
    const service = await this.getServiceDetails(dto.serviceId)
    const requiredStaff = service?.teamMembers?.selectedMembers?.map(m => m.id) || []
    
    const staffAvailable = await this.checkStaffAvailability(
      requiredStaff,
      dto.date,
      dto.startTime,
      endTime
    )
    
    return staffAvailable
  }

  async createStaffAvailability(dto: CreateStaffAvailabilityDto): Promise<StaffAvailabilityDocument> {
    const existingAvailability = await this.staffAvailabilityModel.findOne({
      staffId: new Types.ObjectId(dto.staffId),
      date: new Date(dto.date.getFullYear(), dto.date.getMonth(), dto.date.getDate())
    })

    if (existingAvailability) {
      existingAvailability.availableSlots = dto.availableSlots
      existingAvailability.updatedAt = new Date()
      return await existingAvailability.save()
    }

    const availability = new this.staffAvailabilityModel({
      staffId: new Types.ObjectId(dto.staffId),
      businessId: new Types.ObjectId(dto.businessId),
      date: new Date(dto.date.getFullYear(), dto.date.getMonth(), dto.date.getDate()),
      availableSlots: dto.availableSlots,
      createdBy: new Types.ObjectId(dto.createdBy)
    })

    return await availability.save()
  }

  async blockStaffTime(dto: BlockStaffTimeDto): Promise<void> {
    const availability = await this.staffAvailabilityModel.findOne({
      staffId: new Types.ObjectId(dto.staffId),
      date: new Date(dto.date.getFullYear(), dto.date.getMonth(), dto.date.getDate())
    })

    if (!availability) {
      throw new BadRequestException('Staff availability not found')
    }

    availability.blockedSlots.push({
      startTime: dto.startTime,
      endTime: dto.endTime,
      isBreak: false
    })

    availability.reason = dto.reason
    await availability.save()
  }

  // Private helper methods
  private async getBusinessHours(businessId: string, date: Date): Promise<TimeSlot[]> {
    const businessHours = await this.businessHoursModel.findOne({ 
      businessId: new Types.ObjectId(businessId) 
    })
    
    if (!businessHours) return []

    // Check if it's a holiday
    const isHoliday = businessHours.holidays.some(holiday => 
      holiday.toDateString() === date.toDateString()
    )
    
    if (isHoliday) return []

    // Get day of week schedule
    const dayOfWeek = date.getDay()
    const daySchedule = businessHours.weeklySchedule.find(
      schedule => schedule.dayOfWeek === dayOfWeek
    )

    if (!daySchedule || !daySchedule.isOpen) return []

    return daySchedule.timeSlots.filter(slot => !slot.isBreak)
  }

  private async getStaffAvailability(
    businessId: string,
    staffIds: Types.ObjectId[],
    date: Date
  ): Promise<StaffAvailabilityDocument[]> {
    return await this.staffAvailabilityModel.find({
      businessId: new Types.ObjectId(businessId),
      staffId: { $in: staffIds },
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      status: { $ne: 'unavailable' }
    })
  }

  private generateAvailableSlots(
    businessHours: TimeSlot[],
    staffAvailability: StaffAvailabilityDocument[],
    duration: number
  ): AvailabilitySlot[] {
    const slots: AvailabilitySlot[] = []

    for (const businessHour of businessHours) {
      const startMinutes = this.timeToMinutes(businessHour.startTime)
      const endMinutes = this.timeToMinutes(businessHour.endTime)
      
      for (let currentMinutes = startMinutes; currentMinutes + duration <= endMinutes; currentMinutes += 30) {
        const slotStart = this.minutesToTime(currentMinutes)
        const slotEnd = this.minutesToTime(currentMinutes + duration)
        
        const availableStaff = this.getAvailableStaffForSlot(
          staffAvailability, 
          slotStart, 
          slotEnd
        )
        
        if (availableStaff.length > 0) {
          slots.push({
            startTime: slotStart,
            endTime: slotEnd,
            duration,
            availableStaff,
            availableResources: [],
            isBookable: true
          })
        }
      }
    }

    return slots
  }

  private getAvailableStaffForSlot(
    staffAvailability: StaffAvailabilityDocument[],
    startTime: string,
    endTime: string
  ): Types.ObjectId[] {
    return staffAvailability
      .filter(availability => 
        this.isTimeSlotAvailable(availability.availableSlots, startTime, endTime) &&
        !this.isTimeSlotBlocked(availability.blockedSlots, startTime, endTime)
      )
      .map(availability => availability.staffId)
  }

  private isTimeSlotAvailable(
    availableSlots: TimeSlot[],
    startTime: string,
    endTime: string
  ): boolean {
    return availableSlots.some(slot => 
      slot.startTime <= startTime && slot.endTime >= endTime
    )
  }

  private isTimeSlotBlocked(
    blockedSlots: TimeSlot[],
    startTime: string,
    endTime: string
  ): boolean {
    return blockedSlots.some(slot => 
      !(slot.endTime <= startTime || slot.startTime >= endTime)
    )
  }

  private async isWithinBusinessHours(
    businessId: string,
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    const businessHours = await this.getBusinessHours(businessId, date)
    
    return businessHours.some(hours => 
      hours.startTime <= startTime && hours.endTime >= endTime
    )
  }

  private async checkStaffAvailability(
    staffIds: Types.ObjectId[],
    date: Date,
    startTime: string,
    endTime: string
  ): Promise<boolean> {
    if (staffIds.length === 0) return true

    const availability = await this.staffAvailabilityModel.find({
      staffId: { $in: staffIds },
      date: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
      status: { $ne: 'unavailable' }
    })

    return availability.length >= staffIds.length &&
           availability.every(avail => 
             this.isTimeSlotAvailable(avail.availableSlots, startTime, endTime) &&
             !this.isTimeSlotBlocked(avail.blockedSlots, startTime, endTime)
           )
  }

  private timeToMinutes(time: string): number {
    const [hours, minutes] = time.split(':').map(Number)
    return hours * 60 + minutes
  }

  private minutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`
  }

  private addMinutesToTime(time: string, minutesToAdd: number): string {
    const totalMinutes = this.timeToMinutes(time) + minutesToAdd
    return this.minutesToTime(totalMinutes)
  }

  private async getServiceDetails(serviceId: string): Promise<any> {
    // This would fetch from your Service model
    // For now, return mock structure
    return {
      teamMembers: {
        allTeamMembers: false,
        selectedMembers: [{ id: new Types.ObjectId() }]
      }
    }
  }
}