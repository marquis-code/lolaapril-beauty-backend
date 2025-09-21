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

  async findByType(settingType: string): Promise<BusinessSettings[]> {
    return this.settingsModel.find({ settingType }).exec()
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

  async getBusinessHours(): Promise<BusinessSettings[]> {
    return this.settingsModel.find({ settingType: "business_hours" }).exec()
  }

  async getAppointmentSettings(): Promise<BusinessSettings[]> {
    return this.settingsModel.find({ settingType: "appointment_settings" }).exec()
  }

  async getPaymentSettings(): Promise<BusinessSettings[]> {
    return this.settingsModel.find({ settingType: "payment_settings" }).exec()
  }

  async getNotificationSettings(): Promise<BusinessSettings[]> {
    return this.settingsModel.find({ settingType: "notification_settings" }).exec()
  }

  async updateBusinessHours(businessHours: any): Promise<BusinessSettings> {
    let settings = await this.settingsModel.findOne({ settingType: "business_hours" })

    if (!settings) {
      settings = new this.settingsModel({
        settingType: "business_hours",
        settingKey: "operating_hours",
        settingValue: businessHours,
        description: "Business operating hours",
      })
    } else {
      settings.settingValue = businessHours
    }

    return settings.save()
  }

  async updateAppointmentSettings(appointmentSettings: any): Promise<BusinessSettings> {
    let settings = await this.settingsModel.findOne({ settingType: "appointment_settings" })

    if (!settings) {
      settings = new this.settingsModel({
        settingType: "appointment_settings",
        settingKey: "appointment_config",
        settingValue: appointmentSettings,
        description: "Appointment configuration settings",
      })
    } else {
      settings.settingValue = appointmentSettings
    }

    return settings.save()
  }
}
