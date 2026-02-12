// import { Injectable, NotFoundException } from "@nestjs/common"
// import { Model } from "mongoose"
// import { BusinessSettings, BusinessSettingsDocument, BusinessHours } from "./schemas/business-settings.schema"
// import { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto"
// import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto"
// import { InjectModel } from "@nestjs/mongoose"

// @Injectable()
// export class SettingsService {
//   constructor(
//    @InjectModel(BusinessSettings.name) private settingsModel: Model<BusinessSettingsDocument>) {}

//   async create(createSettingsDto: CreateBusinessSettingsDto): Promise<BusinessSettings> {
//     const settings = new this.settingsModel(createSettingsDto)
//     return settings.save()
//   }

//   async findAll(): Promise<BusinessSettings[]> {
//     return this.settingsModel.find().exec()
//   }

//   async findOne(id: string): Promise<BusinessSettings> {
//     const settings = await this.settingsModel.findById(id)
//     if (!settings) {
//       throw new NotFoundException("Settings not found")
//     }
//     return settings
//   }

//   async findByType(settingType: string): Promise<BusinessSettings[]> {
//     // Since we don't have settingType in schema, return all settings
//     // You might want to filter based on your business logic
//     return this.settingsModel.find().exec()
//   }

//   async update(id: string, updateSettingsDto: UpdateBusinessSettingsDto): Promise<BusinessSettings> {
//     const settings = await this.settingsModel.findByIdAndUpdate(id, updateSettingsDto, { new: true })
//     if (!settings) {
//       throw new NotFoundException("Settings not found")
//     }
//     return settings
//   }

//   async remove(id: string): Promise<void> {
//     const result = await this.settingsModel.findByIdAndDelete(id)
//     if (!result) {
//       throw new NotFoundException("Settings not found")
//     }
//   }

//   // Get business hours from the first business settings document
//   async getBusinessHours(): Promise<BusinessHours[]> {
//     const settings = await this.settingsModel.findOne().exec()
//     return settings?.businessHours || []
//   }

//   // Get appointment statuses (part of appointment settings)
//   async getAppointmentSettings(): Promise<any> {
//     const settings = await this.settingsModel.findOne().exec()
//     if (!settings) return null

//     return {
//       appointmentStatuses: settings.appointmentStatuses,
//       cancellationReasons: settings.cancellationReasons,
//       defaultAppointmentDuration: settings.defaultAppointmentDuration,
//       bookingWindowHours: settings.bookingWindowHours,
//       allowOnlineBooking: settings.allowOnlineBooking,
//       requireClientConfirmation: settings.requireClientConfirmation
//     }
//   }

//   // Get payment related settings
//   async getPaymentSettings(): Promise<any> {
//     const settings = await this.settingsModel.findOne().exec()
//     if (!settings) return null

//     return {
//       paymentMethods: settings.paymentMethods,
//       serviceCharges: settings.serviceCharges,
//       taxes: settings.taxes,
//       defaultCurrency: settings.defaultCurrency
//     }
//   }

//   // For notification settings, you might want to add these to your schema
//   async getNotificationSettings(): Promise<any> {
//     // This would need to be added to your schema or handled differently
//     throw new Error("Notification settings not implemented in current schema")
//   }

//   // Update business hours - expects single parameter (business hours data)
//   async updateBusinessHours(businessHours: BusinessHours[]): Promise<BusinessSettings> {
//     // Get the first/main business settings document
//     let settings = await this.settingsModel.findOne()

//     if (!settings) {
//       throw new NotFoundException("Business settings not found. Please create business settings first.")
//     }

//     settings.businessHours = businessHours
//     // Remove manual updatedAt assignment - timestamps: true handles this automatically
//     return settings.save()
//   }

//   // Update appointment settings - expects single parameter (appointment settings data)
//   async updateAppointmentSettings(appointmentSettings: any): Promise<BusinessSettings> {
//     let settings = await this.settingsModel.findOne()

//     if (!settings) {
//       throw new NotFoundException("Business settings not found. Please create business settings first.")
//     }

//     // Update appointment-related fields
//     if (appointmentSettings.appointmentStatuses) {
//       settings.appointmentStatuses = appointmentSettings.appointmentStatuses
//     }
//     if (appointmentSettings.cancellationReasons) {
//       settings.cancellationReasons = appointmentSettings.cancellationReasons
//     }
//     if (appointmentSettings.defaultAppointmentDuration) {
//       settings.defaultAppointmentDuration = appointmentSettings.defaultAppointmentDuration
//     }
//     if (appointmentSettings.bookingWindowHours) {
//       settings.bookingWindowHours = appointmentSettings.bookingWindowHours
//     }
//     if (typeof appointmentSettings.allowOnlineBooking === 'boolean') {
//       settings.allowOnlineBooking = appointmentSettings.allowOnlineBooking
//     }
//     if (typeof appointmentSettings.requireClientConfirmation === 'boolean') {
//       settings.requireClientConfirmation = appointmentSettings.requireClientConfirmation
//     }

//     // Remove manual updatedAt assignment - timestamps: true handles this automatically
//     return settings.save()
//   }

//   // Update payment settings
//   async updatePaymentSettings(id: string, paymentSettings: any): Promise<BusinessSettings> {
//     const updateData: any = {}

//     if (paymentSettings.paymentMethods) {
//       updateData.paymentMethods = paymentSettings.paymentMethods
//     }
//     if (paymentSettings.serviceCharges) {
//       updateData.serviceCharges = paymentSettings.serviceCharges
//     }
//     if (paymentSettings.taxes) {
//       updateData.taxes = paymentSettings.taxes
//     }
//     if (paymentSettings.defaultCurrency) {
//       updateData.defaultCurrency = paymentSettings.defaultCurrency
//     }

//     // Remove manual updatedAt from updateData - timestamps: true handles this automatically
//     const settings = await this.settingsModel.findByIdAndUpdate(id, updateData, { new: true })

//     if (!settings) {
//       throw new NotFoundException("Settings not found")
//     }

//     return settings
//   }

//   // Helper method to get the main business settings (assuming one per business)
//   async getBusinessSettings(): Promise<BusinessSettings | null> {
//     return this.settingsModel.findOne().exec()
//   }

//   // Create or get default business settings
//   async getOrCreateBusinessSettings(): Promise<BusinessSettings> {
//     let settings = await this.settingsModel.findOne().exec()

//     if (!settings) {
//       // Create default settings - you'll need to provide required fields
//       throw new Error("No business settings found. Please create business settings first.")
//     }

//     return settings
//   }
// }

import { Injectable, NotFoundException, ConflictException } from "@nestjs/common"
import { Model, Types } from "mongoose"
import { BusinessSettings, BusinessSettingsDocument, BusinessHours } from "./schemas/business-settings.schema"
import { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto"
import { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto"
import { InjectModel } from "@nestjs/mongoose"
import { Business, BusinessDocument } from "../business/schemas/business.schema"

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(BusinessSettings.name) private settingsModel: Model<BusinessSettingsDocument>,
    @InjectModel(Business.name) private businessModel: Model<BusinessDocument>
  ) { }

  // ==================== DEFAULT SETTINGS ====================
  private getDefaultBusinessHours(): BusinessHours[] {
    return [
      { day: 'Monday', startTime: '09:00', endTime: '17:00', isOpen: true },
      { day: 'Tuesday', startTime: '09:00', endTime: '17:00', isOpen: true },
      { day: 'Wednesday', startTime: '09:00', endTime: '17:00', isOpen: true },
      { day: 'Thursday', startTime: '09:00', endTime: '17:00', isOpen: true },
      { day: 'Friday', startTime: '09:00', endTime: '17:00', isOpen: true },
      { day: 'Saturday', startTime: '10:00', endTime: '16:00', isOpen: true },
      { day: 'Sunday', startTime: '00:00', endTime: '00:00', isOpen: false },
    ]
  }

  private getDefaultAppointmentSettings() {
    return {
      appointmentStatuses: [
        { statusName: 'Scheduled', statusIcon: '📅', statusColor: '#3b82f6', isActive: true },
        { statusName: 'Confirmed', statusIcon: '✅', statusColor: '#22c55e', isActive: true },
        { statusName: 'In Progress', statusIcon: '🔄', statusColor: '#f59e0b', isActive: true },
        { statusName: 'Completed', statusIcon: '✔️', statusColor: '#10b981', isActive: true },
        { statusName: 'Cancelled', statusIcon: '❌', statusColor: '#ef4444', isActive: true },
        { statusName: 'No Show', statusIcon: '👻', statusColor: '#6b7280', isActive: true },
      ],
      cancellationReasons: [
        { name: 'Schedule conflict', reasonType: 'client_initiated' as const, isActive: true },
        { name: 'Personal emergency', reasonType: 'client_initiated' as const, isActive: true },
        { name: 'Changed mind', reasonType: 'client_initiated' as const, isActive: true },
        { name: 'Staff unavailable', reasonType: 'business_initiated' as const, isActive: true },
        { name: 'Weather conditions', reasonType: 'external_factors' as const, isActive: true },
      ],
      defaultAppointmentDuration: 30,
      bookingWindowHours: 2,
      allowOnlineBooking: true,
      requireClientConfirmation: true
    }
  }

  private getDefaultPaymentSettings() {
    return {
      paymentMethods: [
        { name: 'Cash', paymentType: 'cash' as const, enabled: true },
        { name: 'Bank Transfer', paymentType: 'bank_transfer' as const, enabled: true },
      ],
      serviceCharges: [],
      taxes: [],
      defaultCurrency: 'NGN'
    }
  }

  private getDefaultNotificationSettings() {
    return {
      emailNotifications: true,
      smsNotifications: false,
      pushNotifications: true,
      appointmentReminders: true,
      reminderHoursBefore: 24,
      marketingEmails: false
    }
  }

  // ==================== CREATE ====================
  async create(businessId: string, createSettingsDto: CreateBusinessSettingsDto): Promise<BusinessSettings> {
    // Check if settings already exist for this business
    const existingSettings = await this.settingsModel.findOne({ businessId: new Types.ObjectId(businessId) })

    if (existingSettings) {
      throw new ConflictException("Settings already exist for this business. Use update endpoint instead.")
    }

    const settings = new this.settingsModel({
      ...createSettingsDto,
      businessId: new Types.ObjectId(businessId)
    })

    return settings.save()
  }

  // ==================== READ ====================
  async findByBusinessId(businessId: string): Promise<BusinessSettings> {
    const settings = await this.settingsModel.findOne({ businessId: new Types.ObjectId(businessId) })

    if (!settings) {
      throw new NotFoundException("Settings not found for this business")
    }

    return settings
  }

  /**
   * Find settings by business ID or return null if not found (no exception)
   */
  async findByBusinessIdOrNull(businessId: string): Promise<BusinessSettings | null> {
    return this.settingsModel.findOne({ businessId: new Types.ObjectId(businessId) })
  }

  /**
   * Get settings or create default settings if they don't exist
   */
  async findOrCreateDefault(businessId: string): Promise<BusinessSettings> {
    let settings = await this.settingsModel.findOne({ businessId: new Types.ObjectId(businessId) })

    if (!settings) {
      // Fetch business info to populate required fields
      const business = await this.businessModel.findById(businessId)

      if (!business) {
        throw new NotFoundException("Business not found")
      }

      const appointmentDefaults = this.getDefaultAppointmentSettings()
      const paymentDefaults = this.getDefaultPaymentSettings()

      // Create default settings for this business
      const defaultSettings: Partial<BusinessSettings> = {
        businessId: new Types.ObjectId(businessId),
        businessName: business.businessName || 'My Business',
        businessEmail: business.contact?.email || 'business@example.com',
        businessPhone: {
          countryCode: '+234',
          number: business.contact?.primaryPhone || '0000000000'
        },
        businessAddress: {
          street: business.address?.street || '',
          city: business.address?.city || '',
          region: business.address?.state || '',
          postcode: business.address?.postalCode || '',
          country: business.address?.country || 'Nigeria'
        },
        businessHours: this.getDefaultBusinessHours(),
        appointmentStatuses: appointmentDefaults.appointmentStatuses,
        cancellationReasons: appointmentDefaults.cancellationReasons,
        defaultAppointmentDuration: appointmentDefaults.defaultAppointmentDuration,
        bookingWindowHours: appointmentDefaults.bookingWindowHours,
        allowOnlineBooking: appointmentDefaults.allowOnlineBooking,
        requireClientConfirmation: appointmentDefaults.requireClientConfirmation,
        paymentMethods: paymentDefaults.paymentMethods,
        serviceCharges: paymentDefaults.serviceCharges,
        taxes: paymentDefaults.taxes,
        defaultCurrency: paymentDefaults.defaultCurrency,
        timezone: business.settings?.timezone || 'Africa/Lagos'
      }

      try {
        settings = new this.settingsModel(defaultSettings)
        await settings.save()
        console.log(`✅ Default settings created for business: ${business.businessName}`)
      } catch (error) {
        console.error(`❌ Failed to create default settings for business ${businessId}:`, error)
        // If validation error, log specific details
        if (error.name === 'ValidationError') {
          console.error('Validation Errors:', JSON.stringify(error.errors, null, 2))
        }
        throw new Error(`Failed to initialize business settings: ${error.message}`)
      }
    }

    return settings
  }

  async getBusinessHours(businessId: string): Promise<BusinessHours[]> {
    const settings = await this.findByBusinessIdOrNull(businessId)
    return settings?.businessHours || this.getDefaultBusinessHours()
  }

  async getAppointmentSettings(businessId: string): Promise<any> {
    const settings = await this.findByBusinessIdOrNull(businessId)

    if (!settings) {
      return this.getDefaultAppointmentSettings()
    }

    return {
      appointmentStatuses: settings.appointmentStatuses || this.getDefaultAppointmentSettings().appointmentStatuses,
      cancellationReasons: settings.cancellationReasons || this.getDefaultAppointmentSettings().cancellationReasons,
      defaultAppointmentDuration: settings.defaultAppointmentDuration ?? 30,
      bookingWindowHours: settings.bookingWindowHours ?? 2,
      allowOnlineBooking: settings.allowOnlineBooking ?? true,
      requireClientConfirmation: settings.requireClientConfirmation ?? true
    }
  }

  async getPaymentSettings(businessId: string): Promise<any> {
    const settings = await this.findByBusinessIdOrNull(businessId)

    if (!settings) {
      return this.getDefaultPaymentSettings()
    }

    return {
      paymentMethods: settings.paymentMethods || this.getDefaultPaymentSettings().paymentMethods,
      serviceCharges: settings.serviceCharges || [],
      taxes: settings.taxes || [],
      defaultCurrency: settings.defaultCurrency || 'NGN'
    }
  }

  async getNotificationSettings(businessId: string): Promise<any> {
    // Return default notification settings
    return this.getDefaultNotificationSettings()
  }

  // ==================== UPDATE ====================
  async update(businessId: string, updateSettingsDto: UpdateBusinessSettingsDto): Promise<BusinessSettings> {
    const settings = await this.settingsModel.findOneAndUpdate(
      { businessId: new Types.ObjectId(businessId) },
      updateSettingsDto,
      { new: true, runValidators: true }
    )

    if (!settings) {
      throw new NotFoundException("Settings not found for this business")
    }

    return settings
  }

  async updateBusinessHours(businessId: string, businessHours: BusinessHours[]): Promise<BusinessSettings> {
    const settings = await this.settingsModel.findOneAndUpdate(
      { businessId: new Types.ObjectId(businessId) },
      { businessHours },
      { new: true, runValidators: true }
    )

    if (!settings) {
      throw new NotFoundException("Settings not found for this business")
    }

    return settings
  }

  async updateAppointmentSettings(businessId: string, appointmentSettings: any): Promise<BusinessSettings> {
    const settings = await this.settingsModel.findOne({ businessId: new Types.ObjectId(businessId) })

    if (!settings) {
      throw new NotFoundException("Settings not found for this business")
    }

    // Update appointment-related fields
    if (appointmentSettings.appointmentStatuses) {
      settings.appointmentStatuses = appointmentSettings.appointmentStatuses
    }
    if (appointmentSettings.cancellationReasons) {
      settings.cancellationReasons = appointmentSettings.cancellationReasons
    }
    if (appointmentSettings.defaultAppointmentDuration) {
      settings.defaultAppointmentDuration = appointmentSettings.defaultAppointmentDuration
    }
    if (appointmentSettings.bookingWindowHours) {
      settings.bookingWindowHours = appointmentSettings.bookingWindowHours
    }
    if (typeof appointmentSettings.allowOnlineBooking === 'boolean') {
      settings.allowOnlineBooking = appointmentSettings.allowOnlineBooking
    }
    if (typeof appointmentSettings.requireClientConfirmation === 'boolean') {
      settings.requireClientConfirmation = appointmentSettings.requireClientConfirmation
    }

    return settings.save()
  }

  // ==================== DELETE ====================
  async remove(businessId: string): Promise<void> {
    const result = await this.settingsModel.findOneAndDelete({
      businessId: new Types.ObjectId(businessId)
    })

    if (!result) {
      throw new NotFoundException("Settings not found for this business")
    }
  }

  // ==================== HELPER METHODS ====================
  async getOrCreateBusinessSettings(businessId: string): Promise<BusinessSettings> {
    let settings = await this.settingsModel.findOne({ businessId: new Types.ObjectId(businessId) })

    if (!settings) {
      throw new NotFoundException("No business settings found. Please create business settings first.")
    }

    return settings
  }

  // ==================== LEGACY METHODS (for backward compatibility) ====================

  async findAll(): Promise<BusinessSettings[]> {
    return this.settingsModel.find().exec()
  }

  async findOne(id: string): Promise<BusinessSettings> {
    const settings = await this.settingsModel.findById(id)
    if (!settings) {
      throw new NotFoundException("Settings not found")
    }
    return settings
  }

  async findByType(settingType: string): Promise<BusinessSettings[]> {
    // Since we don't have settingType in schema, return all settings
    // You might want to filter based on your business logic
    return this.settingsModel.find().exec()
  }

  // Update payment settings by ID (legacy method)
  async updatePaymentSettings(id: string, paymentSettings: any): Promise<BusinessSettings> {
    const updateData: any = {}

    if (paymentSettings.paymentMethods) {
      updateData.paymentMethods = paymentSettings.paymentMethods
    }
    if (paymentSettings.serviceCharges) {
      updateData.serviceCharges = paymentSettings.serviceCharges
    }
    if (paymentSettings.taxes) {
      updateData.taxes = paymentSettings.taxes
    }
    if (paymentSettings.defaultCurrency) {
      updateData.defaultCurrency = paymentSettings.defaultCurrency
    }

    const settings = await this.settingsModel.findByIdAndUpdate(id, updateData, { new: true })

    if (!settings) {
      throw new NotFoundException("Settings not found")
    }

    return settings
  }

  // Get the main business settings (assuming one per business) - legacy method
  async getBusinessSettings(): Promise<BusinessSettings | null> {
    return this.settingsModel.findOne().exec()
  }
}