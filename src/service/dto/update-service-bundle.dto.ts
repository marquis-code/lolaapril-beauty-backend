import { PartialType } from "@nestjs/swagger"
import { CreateServiceBundleDto } from "./create-service-bundle.dto"

export class UpdateServiceBundleDto extends PartialType(CreateServiceBundleDto) {}
