import { IsString, IsEmail, IsOptional, ValidateNested, IsArray, IsEnum } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class PhoneDto {
  @ApiProperty()
  @IsString()
  countryCode: string

  @ApiProperty()
  @IsString()
  number: string
}

export class BirthdayDto {
  @ApiProperty()
  @IsString()
  dayAndMonth: string

  @ApiProperty()
  @IsString()
  year: string
}

export class EmergencyContactDto {
  @ApiProperty()
  @IsString()
  fullName: string

  @ApiProperty()
  @IsString()
  relationship: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty({ type: PhoneDto })
  @ValidateNested()
  @Type(() => PhoneDto)
  phone: PhoneDto
}

export class AddressDto {
  @ApiProperty()
  @IsString()
  addressName: string

  @ApiProperty()
  @IsString()
  addressType: string

  @ApiProperty()
  @IsString()
  street: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aptSuite?: string

  @ApiProperty()
  @IsString()
  district: string

  @ApiProperty()
  @IsString()
  city: string

  @ApiProperty()
  @IsString()
  region: string

  @ApiProperty()
  @IsString()
  postcode: string

  @ApiProperty()
  @IsString()
  country: string
}

export class ClientSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  appointmentNotifications?: { emailNotifications: boolean }

  @ApiPropertyOptional()
  @IsOptional()
  marketingNotifications?: { clientAcceptsEmailMarketing: boolean }
}

export class CreateClientDto {
  @ApiProperty()
  @IsString()
  firstName: string

  @ApiProperty()
  @IsString()
  lastName: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiProperty({ type: PhoneDto })
  @ValidateNested()
  @Type(() => PhoneDto)
  phone: PhoneDto

  @ApiPropertyOptional({ type: BirthdayDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BirthdayDto)
  birthday?: BirthdayDto

  @ApiPropertyOptional({ enum: ["Male", "Female", "Other", "Prefer not to say"] })
  @IsOptional()
  @IsEnum(["Male", "Female", "Other", "Prefer not to say"])
  gender?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  pronouns?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  additionalEmail?: string

  @ApiPropertyOptional({ type: PhoneDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PhoneDto)
  additionalPhone?: PhoneDto

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  clientSource?: string

  @ApiPropertyOptional()
  @IsOptional()
  referredBy?: { clientId: string; clientName: string }

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  preferredLanguage?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  occupation?: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  country?: string

  @ApiPropertyOptional()
  @IsOptional()
  emergencyContacts?: {
    primary?: EmergencyContactDto
    secondary?: EmergencyContactDto
  }

  @ApiPropertyOptional({ type: AddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AddressDto)
  address?: AddressDto

  @ApiPropertyOptional({ type: ClientSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ClientSettingsDto)
  settings?: ClientSettingsDto

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[]

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string
}
