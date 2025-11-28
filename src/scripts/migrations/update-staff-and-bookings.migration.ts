// scripts/migrations/update-staff-and-bookings.migration.ts
import { Injectable, Logger } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { Booking } from '../../booking/schemas/booking.schema'
import { Staff } from '../../staff/schemas/staff.schema'
import { StaffSchedule } from '../../staff/schemas/staff-schedule.schema'
import { StaffAvailability } from '../../availability/schemas/staff-availability.schema'
import { BusinessHours } from '../../availability/schemas/business-hours.schema'

@Injectable()
export class StaffBookingMigrationService {
  private readonly logger = new Logger(StaffBookingMigrationService.name)

  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<Booking>,
    @InjectModel(Staff.name) private staffModel: Model<Staff>,
    @InjectModel(StaffSchedule.name) private staffScheduleModel: Model<StaffSchedule>,
    @InjectModel(StaffAvailability.name) private staffAvailabilityModel: Model<StaffAvailability>,
    @InjectModel(BusinessHours.name) private businessHoursModel: Model<BusinessHours>,
  ) {}

  /**
   * Main migration method
   */
  async runMigration(): Promise<{
    success: boolean
    bookingsUpdated: number
    staffSchedulesCreated: number
    staffAvailabilityCreated: number
    businessHoursUpdated: number
    errors: string[]
  }> {
    this.logger.log('🚀 Starting migration...')
    
    const errors: string[] = []
    let bookingsUpdated = 0
    let staffSchedulesCreated = 0
    let staffAvailabilityCreated = 0
    let businessHoursUpdated = 0

    try {
      // STEP 1: Remove preferredStaffId from existing bookings
      this.logger.log('📝 Step 1: Removing preferredStaffId from bookings...')
      const bookingUpdateResult = await this.removePreferredStaffFromBookings()
      bookingsUpdated = bookingUpdateResult.modifiedCount
      this.logger.log(`✅ Updated ${bookingsUpdated} bookings`)

      // STEP 2: Update all staff schedules to 24/7
      this.logger.log('📅 Step 2: Creating 24/7 schedules for staff...')
      staffSchedulesCreated = await this.create24x7StaffSchedules()
      this.logger.log(`✅ Created ${staffSchedulesCreated} staff schedules`)

      // STEP 3: Create 90-day availability for all staff
      this.logger.log('📆 Step 3: Creating 90-day availability for all staff...')
      staffAvailabilityCreated = await this.create90DayStaffAvailability()
      this.logger.log(`✅ Created ${staffAvailabilityCreated} availability records`)

      // STEP 4: Update business hours to 24/7
      this.logger.log('🏢 Step 4: Updating business hours to 24/7...')
      businessHoursUpdated = await this.updateBusinessHoursTo24x7()
      this.logger.log(`✅ Updated ${businessHoursUpdated} business hours`)

      this.logger.log('✅ Migration completed successfully!')

      return {
        success: true,
        bookingsUpdated,
        staffSchedulesCreated,
        staffAvailabilityCreated,
        businessHoursUpdated,
        errors
      }
    } catch (error) {
      this.logger.error(`❌ Migration failed: ${error.message}`)
      errors.push(error.message)
      
      return {
        success: false,
        bookingsUpdated,
        staffSchedulesCreated,
        staffAvailabilityCreated,
        businessHoursUpdated,
        errors
      }
    }
  }

  /**
   * Remove preferredStaffId from all bookings
   */
  private async removePreferredStaffFromBookings(): Promise<any> {
    try {
      // Use MongoDB $unset to remove the field from all services
      const result = await this.bookingModel.updateMany(
        {},
        {
          $unset: {
            'services.$[].preferredStaffId': ''
          }
        }
      ).exec()

      return result
    } catch (error) {
      this.logger.error(`Failed to remove preferredStaffId: ${error.message}`)
      throw error
    }
  }

  /**
   * Create 24/7 schedules for all staff members
   */
  private async create24x7StaffSchedules(): Promise<number> {
    let count = 0

    try {
      // Get all active staff
      const allStaff = await this.staffModel.find({ status: 'active' }).exec()

      for (const staff of allStaff) {
        // Check if staff already has a 24/7 schedule
        const existingSchedule = await this.staffScheduleModel.findOne({
          staffId: staff._id,
          isDefault24_7: true
        }).exec()

        if (existingSchedule) {
          this.logger.log(`Staff ${staff.staffId} already has 24/7 schedule, skipping...`)
          continue
        }

        // Deactivate existing schedules
        await this.staffScheduleModel.updateMany(
          { staffId: staff._id },
          { isActive: false }
        ).exec()

        // Create 24/7 schedule
        const weeklySchedule = []
        for (let day = 0; day <= 6; day++) {
          weeklySchedule.push({
            dayOfWeek: day,
            isWorkingDay: true,
            workingHours: [{
              startTime: '00:00',
              endTime: '23:59',
              isBreak: false
            }],
            breaks: [],
            maxHoursPerDay: 24
          })
        }

        await this.staffScheduleModel.create({
          staffId: staff._id,
          businessId: staff.businessId,
          effectiveDate: new Date(),
          weeklySchedule,
          scheduleType: '24_7',
          reason: 'Migration to 24/7 default schedule',
          isActive: true,
          isDefault24_7: true,
          createdBy: staff.userId
        })

        count++
        this.logger.log(`✅ Created 24/7 schedule for staff ${staff.staffId}`)
      }

      return count
    } catch (error) {
      this.logger.error(`Failed to create staff schedules: ${error.message}`)
      throw error
    }
  }

  /**
   * Create 90-day availability for all staff
   */
  private async create90DayStaffAvailability(): Promise<number> {
    let count = 0

    try {
      const allStaff = await this.staffModel.find({ status: 'active' }).exec()
      const today = new Date()
      const endDate = new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000)

      for (const staff of allStaff) {
        for (let currentDate = new Date(today); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
          const date = new Date(currentDate)
          const normalizedDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())

          // Check if availability already exists
          const existing = await this.staffAvailabilityModel.findOne({
            staffId: staff._id,
            date: normalizedDate
          }).exec()

          if (existing) {
            continue
          }

          // Create 24/7 availability
          await this.staffAvailabilityModel.create({
            staffId: staff._id,
            businessId: staff.businessId,
            date: normalizedDate,
            availableSlots: [{
              startTime: '00:00',
              endTime: '23:59',
              isBreak: false
            }],
            blockedSlots: [],
            status: 'available',
            createdBy: staff.userId
          })

          count++
        }

        this.logger.log(`✅ Created 90-day availability for staff ${staff.staffId}`)
      }

      return count
    } catch (error) {
      this.logger.error(`Failed to create staff availability: ${error.message}`)
      throw error
    }
  }

  /**
   * Update business hours to 24/7
   */
  private async updateBusinessHoursTo24x7(): Promise<number> {
    let count = 0

    try {
      const allBusinessHours = await this.businessHoursModel.find({}).exec()

      for (const businessHour of allBusinessHours) {
        // Update to 24/7
        businessHour.operates24x7 = true
        businessHour.weeklySchedule = []

        for (let day = 0; day <= 6; day++) {
          businessHour.weeklySchedule.push({
            dayOfWeek: day,
            isOpen: true,
            is24Hours: true,
            timeSlots: [{
              startTime: '00:00',
              endTime: '23:59',
              isBreak: false
            }]
          })
        }

        await businessHour.save()
        count++

        this.logger.log(`✅ Updated business hours to 24/7 for business ${businessHour.businessId}`)
      }

      return count
    } catch (error) {
      this.logger.error(`Failed to update business hours: ${error.message}`)
      throw error
    }
  }

  /**
   * Rollback migration (if needed)
   */
  async rollback(): Promise<void> {
    this.logger.warn('⚠️ Starting migration rollback...')
    
    try {
      // This is optional - you may not want to rollback
      this.logger.warn('Rollback not implemented - migration changes are permanent')
    } catch (error) {
      this.logger.error(`Rollback failed: ${error.message}`)
      throw error
    }
  }
}

// /**
//  * CLI script to run migration
//  */
// export async function runMigration() {
//   // This would be called from your CLI or admin endpoint
//   const migrationService = new StaffBookingMigrationService(
//     // Inject your models here
//   )
  
//   const result = await migrationService.runMigration()
  
//   console.log('Migration Results:', result)
  
//   if (!result.success) {
//     console.error('Migration failed with errors:', result.errors)
//     process.exit(1)
//   }
  
//   process.exit(0)
// }