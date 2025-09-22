import { PartialType } from "@nestjs/swagger"
import { CreateBusinessSettingsDto } from "./create-business-settings.dto"

export class UpdateBusinessSettingsDto extends PartialType(CreateBusinessSettingsDto) {}