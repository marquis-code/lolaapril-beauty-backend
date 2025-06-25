import { IsNotEmpty, IsString, IsArray, ValidateNested, IsEmail } from "class-validator"
import { Type } from "class-transformer"

class FormResponseDto {
  @IsNotEmpty()
  @IsString()
  fieldId: string

  @IsNotEmpty()
  @IsString()
  fieldLabel: string

  @IsNotEmpty()
  @IsString()
  value: string
}

export class SubmitApplicationDto {
  @IsEmail()
  applicantEmail: string

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FormResponseDto)
  responses: FormResponseDto[]
}
