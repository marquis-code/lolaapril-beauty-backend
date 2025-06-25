import { IsNotEmpty, IsString, IsArray, IsOptional, ValidateNested, IsEnum, IsBoolean, IsUrl } from "class-validator"
import { Type } from "class-transformer"
import { FormFieldType } from "../../common/enums"

class FormFieldDto {
  @IsNotEmpty()
  @IsString()
  id: string

  @IsNotEmpty()
  @IsString()
  label: string

  @IsEnum(FormFieldType)
  type: FormFieldType

  @IsOptional()
  @IsBoolean()
  required?: boolean

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[]

  @IsOptional()
  @IsString()
  placeholder?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  validation?: string
}

export class CreateFormDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  instructions?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  fields: FormFieldDto[]

  @IsOptional()
  @IsString()
  successMessage?: string

  @IsOptional()
  @IsUrl()
  redirectUrl?: string
}
