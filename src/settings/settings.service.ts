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

@Injectable()
export class SettingsService {
  constructor(
    @InjectModel(BusinessSettings.name) private settingsModel: Model<BusinessSettingsDocument>
  ) {}

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

  async getBusinessHours(businessId: string): Promise<BusinessHours[]> {
    const settings = await this.findByBusinessId(businessId)
    return settings.businessHours || []
  }

  async getAppointmentSettings(businessId: string): Promise<any> {
    const settings = await this.findByBusinessId(businessId)
    
    return {
      appointmentStatuses: settings.appointmentStatuses,
      cancellationReasons: settings.cancellationReasons,
      defaultAppointmentDuration: settings.defaultAppointmentDuration,
      bookingWindowHours: settings.bookingWindowHours,
      allowOnlineBooking: settings.allowOnlineBooking,
      requireClientConfirmation: settings.requireClientConfirmation
    }
  }

  async getPaymentSettings(businessId: string): Promise<any> {
    const settings = await this.findByBusinessId(businessId)

    return {
      paymentMethods: settings.paymentMethods,
      serviceCharges: settings.serviceCharges,
      taxes: settings.taxes,
      defaultCurrency: settings.defaultCurrency
    }
  }

  async getNotificationSettings(businessId: string): Promise<any> {
    const settings = await this.findByBusinessId(businessId)
    
    // Return notification settings if they exist in schema, or throw error
    throw new Error("Notification settings not implemented in current schema")
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