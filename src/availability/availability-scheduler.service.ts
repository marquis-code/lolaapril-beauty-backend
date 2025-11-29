// src/modules/availability/availability-scheduler.service.ts
import { Injectable, Logger } from '@nestjs/common'
import { Cron, CronExpression } from '@nestjs/schedule'
import { AvailabilityService } from './availability.service'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { BusinessHours, BusinessHoursDocument } from './schemas/business-hours.schema'

@Injectable()
export class AvailabilitySchedulerService {
  private readonly logger = new Logger(AvailabilitySchedulerService.name)

  constructor(
    private readonly availabilityService: AvailabilityService,
    @InjectModel(BusinessHours.name)
    private businessHoursModel: Model<BusinessHoursDocument>,
  ) {}

  /**
   * Runs every day at 2:00 AM
   * Extends staff availability for all businesses
   */
  @Cron(CronExpression.EVERY_DAY_AT_2AM)
  async extendDailyAvailability() {
    this.logger.log('🔄 Starting daily availability extension...')
    
    try {
      // Get all businesses with 24/7 operation enabled
      const businesses = await this.businessHoursModel
        .find({ operates24x7: true })
        .select('businessId')
        .exec()
      
      this.logger.log(`Found ${businesses.length} 24/7 businesses to process`)
      
      let successCount = 0
      let errorCount = 0
      
      for (const business of businesses) {
        try {
          await this.availabilityService.ensureAllStaffAvailability(
            business.businessId.toString(),
            90 // Ensure next 90 days always have availability
          )
          successCount++
          this.logger.log(`✅ Extended availability for business: ${business.businessId}`)
        } catch (error) {
          errorCount++
          this.logger.error(
            `❌ Failed to extend availability for business ${business.businessId}:`,
            error.message
          )
        }
      }
      
      this.logger.log(
        `✅ Daily availability extension completed. Success: ${successCount}, Errors: ${errorCount}`
      )
    } catch (error) {
      this.logger.error('❌ Critical error in daily availability extension:', error)
    }
  }

  /**
   * Runs every Sunday at 3:00 AM
   * Cleans up old availability records (optional)
   */
  @Cron('0 3 * * 0') // Every Sunday at 3 AM
  async cleanupOldAvailability() {
    this.logger.log('🧹 Starting weekly cleanup of old availability records...')
    
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      
      const result = await this.availabilityService.deleteOldAvailability(thirtyDaysAgo)
      
      this.logger.log(`✅ Cleanup completed. Deleted ${result.deletedCount} old records`)
    } catch (error) {
      this.logger.error('❌ Error during cleanup:', error)
    }
  }

  /**
   * Runs every hour
   * Checks if any business needs immediate availability extension
   */
  @Cron(CronExpression.EVERY_HOUR)
  async checkLowAvailability() {
    this.logger.log('🔍 Checking for businesses with low availability...')
    
    try {
      const businesses = await this.businessHoursModel
        .find({ operates24x7: true })
        .select('businessId')
        .exec()
      
      const sevenDaysFromNow = new Date()
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
      
      for (const business of businesses) {
        const hasLowAvailability = await this.availabilityService.checkAvailabilityGap(
          business.businessId.toString(),
          sevenDaysFromNow
        )
        
        if (hasLowAvailability) {
          this.logger.warn(
            `⚠️ Business ${business.businessId} has availability gaps. Extending now...`
          )
          await this.availabilityService.ensureAllStaffAvailability(
            business.businessId.toString(),
            90
          )
        }
      }
      
      this.logger.log('✅ Low availability check completed')
    } catch (error) {
      this.logger.error('❌ Error during low availability check:', error)
    }
  }
}