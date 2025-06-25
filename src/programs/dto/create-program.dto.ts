import { IsNotEmpty, IsString, IsArray, IsOptional, ValidateNested, IsEnum } from "class-validator"
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
}

class HighlightDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  description: string
}

export class CreateProgramDto {
  @IsNotEmpty()
  @IsString()
  title: string

  @IsNotEmpty()
  @IsString()
  category: string

  @IsNotEmpty()
  @IsString()
  description: string

  @IsOptional()
  @IsString()
  duration?: string

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  focusAreas?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  outcomes?: string[]

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keyResponsibilities?: string[]

  @IsOptional()
  @IsString()
  image?: string

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => HighlightDto)
  highlights?: HighlightDto[]

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormFieldDto)
  formFields: FormFieldDto[]

  @IsOptional()
  @IsString()
  formTitle?: string

  @IsOptional()
  @IsString()
  formInstructions?: string
}
