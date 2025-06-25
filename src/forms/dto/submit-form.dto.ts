import { IsArray, IsOptional, ValidateNested, IsEmail, IsString } from "class-validator"
import { Type } from "class-transformer"

class FormResponseDto {
  @IsString()
  fieldId: string

  @IsString()
  fieldLabel: string

  @IsString()
  value: string
}

export class SubmitFormDto {
  @IsOptional()
  @IsEmail()
  submitterEmail?: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormResponseDto)
  responses: FormResponseDto[]
}
