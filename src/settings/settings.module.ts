import { Module } from "@nestjs/common"
import { MongooseModule } from "@nestjs/mongoose"
import { SettingsService } from "./settings.service"
import { SettingsController } from "./settings.controller"
import { BusinessSettings, BusinessSettingsSchema } from "./schemas/business-settings.schema"
import { AuditModule } from "../audit/audit.module"

@Module({
  imports: [MongooseModule.forFeature([{ name: BusinessSettings.name, schema: BusinessSettingsSchema }]), AuditModule],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
