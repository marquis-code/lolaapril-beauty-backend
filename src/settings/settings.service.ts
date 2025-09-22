import { Injectable, NotFoundException } from "@nestjs/common"
import type { Model } from "mongoose"
import type { BusinessSettings, BusinessSettingsDocument } from "./schemas/business-settings.schema"
import type { CreateBusinessSettingsDto } from "./dto/create-business-settings.dto"
import type { UpdateBusinessSettingsDto } from "./dto/update-business-settings.dto"

@Injectable()
export class SettingsService {
  constructor(private settingsModel: Model<BusinessSettingsDocument>) {}

  async create(createSettingsDto: CreateBusinessSettingsDto): Promise<BusinessSettings> {
    const settings = new this.settingsModel(createSettingsDto)
    return settings.save()
  }

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

  async findByBusinessName(businessName: string): Promise<BusinessSettings | null> {
    return this.settingsModel.findOne({ businessName }).exec()
  }

  async update(id: string, updateSettingsDto: UpdateBusinessSettingsDto): Promise<BusinessSettings> {
    const settings = await this.settingsModel.findByIdAndUpdate(id, updateSettingsDto, { new: true })
    if (!settings) {
      throw new NotFoundException("Settings not found")
    }
    return settings
  }

  async remove(id: string): Promise<void> {
    const result = await this.settingsModel.findByIdAndDelete(id)
    if (!result) {
      throw new NotFoundException("Settings not found")
    }
  }

  async getBusinessSettings(): Promise<BusinessSettings | null> {
    return this.settingsModel.findOne().exec()
  }

  async updateBusinessHours(businessHours: any[]): Promise<BusinessSettings> {
    let settings = await this.settingsModel.findOne()

    if (!settings) {
      // Create new settings if none exist
      settings = new this.settingsModel({
        businessName: "Default Business",
        businessEmail: "info@business.com",
        businessPhone: { countryCode: "+1", number: "000-000-0000" },
        businessAddress: {
          street: "Default Street",
          city: "Default City",
          region: "Default Region",
          postcode: "00000",
          country: "Default Country"
        },
        businessHours: businessHours,
      })
    } else {
      settings.businessHours = businessHours
    }

    return settings.save()
  }

  async updateAppointmentSettings(appointmentSettings: {
    defaultAppointmentDuration?: number
    bookingWindowHours?: number
    allowOnlineBooking?: boolean
    requireClientConfirmation?: boolean
  }): Promise<BusinessSettings> {
    let settings = await this.settingsModel.findOne()

    if (!settings) {
      throw new NotFoundException("Business settings not found. Please create business settings first.")
    }

    // Update appointment-related fields
    if (appointmentSettings.defaultAppointmentDuration !== undefined) {
      settings.defaultAppointmentDuration = appointmentSettings.defaultAppointmentDuration
    }
    if (appointmentSettings.bookingWindowHours !== undefined) {
      settings.bookingWindowHours = appointmentSettings.bookingWindowHours
    }
    if (appointmentSettings.allowOnlineBooking !== undefined) {
      settings.allowOnlineBooking = appointmentSettings.allowOnlineBooking
    }
    if (appointmentSettings.requireClientConfirmation !== undefined) {
      settings.requireClientConfirmation = appointmentSettings.requireClientConfirmation
    }

    return settings.save()
  }

  async updatePaymentSettings(paymentMethods: any[]): Promise<BusinessSettings> {
    let settings = await this.settingsModel.findOne()

    if (!settings) {
      throw new NotFoundException("Business settings not found. Please create business settings first.")
    }

    settings.paymentMethods = paymentMethods
    return settings.save()
  }

  async updateNotificationSettings(notificationSettings: any): Promise<BusinessSettings> {
    let settings = await this.settingsModel.findOne()

    if (!settings) {
      throw new NotFoundException("Business settings not found. Please create business settings first.")
    }

    // Assuming you have notification settings in your schema
    // If not, you might need to add them to the schema
    return settings.save()
  }
}