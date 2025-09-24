// import { IsString, IsEmail, IsOptional, ValidateNested } from "class-validator"
// import { Type } from "class-transformer"
// import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
// import { PhoneDto, AddressDto } from "../../common/dto/common.dto"

// export class EmergencyContactDto {
//   @ApiProperty({ example: "John Hancock Sr." })
//   @IsString()
//   fullName: string

//   @ApiProperty({ example: "Parent" })
//   @IsString()
//   relationship: string

//   @ApiPropertyOptional({ example: "emergency1@domain.com" })
//   @IsOptional()
//   @IsEmail()
//   email?: string

//   @ApiProperty({ type: PhoneDto })
//   @ValidateNested()
//   @Type(() => PhoneDto)
//   phone: PhoneDto
// }

// export class ClientProfileDto {
//   @ApiProperty({ example: "John" })
//   @IsString()
//   firstName: string

//   @ApiProperty({ example: "Hancock" })
//   @IsString()
//   lastName: string

//   @ApiProperty({ example: "example@domain.com" })
//   @IsEmail()
//   email: string

//   @ApiProperty({ type: PhoneDto })
//   @ValidateNested()
//   @Type(() => PhoneDto)
//   phone: PhoneDto

//   @ApiPropertyOptional({
//     type: "object",
//     properties: {
//       dayAndMonth: { type: "string", example: "01-15" },
//       year: { type: "string", example: "1990" },
//     },
//   })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => Object)
//   birthday?: {
//     dayAndMonth: string
//     year: string
//   }

//   @ApiPropertyOptional({ example: "Male" })
//   @IsOptional()
//   @IsString()
//   gender?: string

//   @ApiPropertyOptional({ example: "He/Him" })
//   @IsOptional()
//   @IsString()
//   pronouns?: string

//   @ApiPropertyOptional({ example: "example+1@domain.com" })
//   @IsOptional()
//   @IsEmail()
//   additionalEmail?: string

//   @ApiPropertyOptional({ type: PhoneDto })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => PhoneDto)
//   additionalPhone?: PhoneDto
// }

// export class AdditionalInfoDto {
//   @ApiPropertyOptional({ example: "Walk-In" })
//   @IsOptional()
//   @IsString()
//   clientSource?: string

//   @ApiPropertyOptional({
//     type: "object",
//     properties: {
//       clientId: { type: "string", example: "12345" },
//       clientName: { type: "string", example: "Jane Smith" },
//     },
//   })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => Object)
//   referredBy?: {
//     clientId: string
//     clientName: string
//   }

//   @ApiPropertyOptional({ example: "English" })
//   @IsOptional()
//   @IsString()
//   preferredLanguage?: string

//   @ApiPropertyOptional({ example: "Software Engineer" })
//   @IsOptional()
//   @IsString()
//   occupation?: string

//   @ApiPropertyOptional({ example: "Nigeria" })
//   @IsOptional()
//   @IsString()
//   country?: string
// }

// export class ClientSettingsDto {
//   @ApiPropertyOptional({
//     type: "object",
//     properties: {
//       emailNotifications: { type: "boolean", default: true },
//     },
//   })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => Object)
//   appointmentNotifications?: {
//     emailNotifications: boolean
//   }

//   @ApiPropertyOptional({
//     type: "object",
//     properties: {
//       clientAcceptsEmailMarketing: { type: "boolean", default: false },
//     },
//   })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => Object)
//   marketingNotifications?: {
//     clientAcceptsEmailMarketing: boolean
//   }
// }

// export class CreateClientDto {
//   @ApiProperty({ type: ClientProfileDto })
//   @ValidateNested()
//   @Type(() => ClientProfileDto)
//   profile: ClientProfileDto

//   @ApiPropertyOptional({ type: AdditionalInfoDto })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => AdditionalInfoDto)
//   additionalInfo?: AdditionalInfoDto

//   @ApiPropertyOptional({
//     type: "object",
//     properties: {
//       primary: { $ref: "#/components/schemas/EmergencyContactDto" },
//       secondary: { $ref: "#/components/schemas/EmergencyContactDto" },
//     },
//   })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => Object)
//   emergencyContacts?: {
//     primary?: EmergencyContactDto
//     secondary?: EmergencyContactDto
//   }

//   @ApiPropertyOptional({ type: AddressDto })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => AddressDto)
//   address?: AddressDto

//   @ApiPropertyOptional({ type: ClientSettingsDto })
//   @IsOptional()
//   @ValidateNested()
//   @Type(() => ClientSettingsDto)
//   settings?: ClientSettingsDto
// }



import { IsString, IsEmail, IsOptional, ValidateNested } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"
import { PhoneDto, AddressDto } from "../../common/dto/common.dto"

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

  @ApiPropertyOptional({
    type: "object",
    properties: {
      dayAndMonth: { type: "string", example: "01-15" },
      year: { type: "string", example: "1990" },
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  birthday?: {
    dayAndMonth: string
    year: string
  }

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

  @ApiPropertyOptional({
    type: "object",
    properties: {
      clientId: { type: "string", example: "12345" },
      clientName: { type: "string", example: "Jane Smith" },
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  referredBy?: {
    clientId: string
    clientName: string
  }

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

export class ClientSettingsDto {
  @ApiPropertyOptional({
    type: "object",
    properties: {
      emailNotifications: { type: "boolean", default: true },
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  appointmentNotifications?: {
    emailNotifications: boolean
  }

  @ApiPropertyOptional({
    type: "object",
    properties: {
      clientAcceptsEmailMarketing: { type: "boolean", default: false },
    },
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => Object)
  marketingNotifications?: {
    clientAcceptsEmailMarketing: boolean
  }
}

// Create a proper DTO class for emergency contacts
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