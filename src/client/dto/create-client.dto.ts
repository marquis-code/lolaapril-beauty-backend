import {
  IsString,
  IsEmail,
  IsOptional,
  ValidateNested,
  IsBoolean,
} from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { PhoneDto, AddressDto } from "../../common/dto/common.dto"

/** --------------------- Small Nested DTOs --------------------- */

export class BirthdayDto {
  @ApiProperty({ example: "01-15" })
  @IsString()
  dayAndMonth: string

  @ApiProperty({ example: "1990" })
  @IsString()
  year: string
}

export class ReferredByDto {
  @ApiProperty({ example: "12345" })
  @IsString()
  clientId: string

  @ApiProperty({ example: "Jane Smith" })
  @IsString()
  clientName: string
}

/** --------------------- Main DTOs --------------------- */

export class EmergencyContactDto {
  @ApiProperty({ example: "John Hancock Sr." })
  @IsString()
  fullName: string

  @ApiProperty({ example: "Parent" })
  @IsString()
  relationship: string

  @ApiPropertyOptional({ example: "emergency1@domain.com" })
  @IsOptional()
  @IsEmail()
  email?: string

  @ApiProperty({ type: PhoneDto })
  @ValidateNested()
  @Type(() => PhoneDto)
  phone: PhoneDto
}

export class ClientProfileDto {
  @ApiProperty({ example: "John" })
  @IsString()
  firstName: string

  @ApiProperty({ example: "Hancock" })
  @IsString()
  lastName: string

  @ApiProperty({ example: "example@domain.com" })
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

  @ApiPropertyOptional({ example: "Male" })
  @IsOptional()
  @IsString()
  gender?: string

  @ApiPropertyOptional({ example: "He/Him" })
  @IsOptional()
  @IsString()
  pronouns?: string

  @ApiPropertyOptional({ example: "example+1@domain.com" })
  @IsOptional()
  @IsEmail()
  additionalEmail?: string

  @ApiPropertyOptional({ type: PhoneDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PhoneDto)
  additionalPhone?: PhoneDto
}

export class AdditionalInfoDto {
  @ApiPropertyOptional({ example: "Walk-In" })
  @IsOptional()
  @IsString()
  clientSource?: string

  @ApiPropertyOptional({ type: ReferredByDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => ReferredByDto)
  referredBy?: ReferredByDto

  @ApiPropertyOptional({ example: "English" })
  @IsOptional()
  @IsString()
  preferredLanguage?: string

  @ApiPropertyOptional({ example: "Software Engineer" })
  @IsOptional()
  @IsString()
  occupation?: string

  @ApiPropertyOptional({ example: "Nigeria" })
  @IsOptional()
  @IsString()
  country?: string
}

export class AppointmentNotificationsDto {
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  emailNotifications?: boolean
}

export class MarketingNotificationsDto {
  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  clientAcceptsEmailMarketing?: boolean
}

export class ClientSettingsDto {
  @ApiPropertyOptional({ type: AppointmentNotificationsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AppointmentNotificationsDto)
  appointmentNotifications?: AppointmentNotificationsDto

  @ApiPropertyOptional({ type: MarketingNotificationsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => MarketingNotificationsDto)
  marketingNotifications?: MarketingNotificationsDto
}


export class EmergencyContactsDto {
  @ApiPropertyOptional({ type: EmergencyContactDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  primary?: EmergencyContactDto

  @ApiPropertyOptional({ type: EmergencyContactDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactDto)
  secondary?: EmergencyContactDto
}

export class CreateClientDto {
  @ApiProperty({ type: ClientProfileDto })
  @ValidateNested()
  @Type(() => ClientProfileDto)
  profile: ClientProfileDto

  @ApiPropertyOptional({ type: AdditionalInfoDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => AdditionalInfoDto)
  additionalInfo?: AdditionalInfoDto

  @ApiPropertyOptional({ type: EmergencyContactsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => EmergencyContactsDto)
  emergencyContacts?: EmergencyContactsDto

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
}
