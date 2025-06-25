import { PartialType } from "@nestjs/mapped-types"
import { CreateFormDto } from "./create-form.dto"
import { IsOptional, IsString, IsBoolean } from "class-validator"

export class UpdateFormDto extends PartialType(CreateFormDto) {
  @IsOptional()
  @IsString()
  slug?: string

  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}
