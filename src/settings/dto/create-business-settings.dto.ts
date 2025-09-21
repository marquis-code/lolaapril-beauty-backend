import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNumber,
  IsEnum,
  IsBoolean,
  IsEmail,
} from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class BusinessHoursDto {
  @ApiProperty({ example: "Monday" })
  @IsString()
  @IsNotEmpty()
  day: string

  @ApiProperty({ example: "09:00" })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ example: "17:00" })
  @IsString()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({ example: true })
  @IsBoolean()
  isOpen: boolean
}

export class AppointmentStatusDto {
  @ApiProperty({ example: "Confirmed" })
  @IsString()
  @IsNotEmpty()
  statusName: string

  @ApiProperty({ example: "play" })
  @IsString()
  @IsNotEmpty()
  statusIcon: string

  @ApiProperty({ example: "#40E0D0" })
  @IsString()
  @IsNotEmpty()
  statusColor: string

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @IsNumber()
  characterLimit?: number
}

export class CancellationReasonDto {
  @ApiProperty({ example: "Client Emergency" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: "client_initiated",
    enum: ["client_initiated", "business_initiated", "external_factors"],
  })
  @IsEnum(["client_initiated", "business_initiated", "external_factors"])
  reasonType: string
}

export class ResourceDto {
  @ApiProperty({ example: "Massage Room 1" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: "Spacious private room equipped with premium massage table, aromatherapy diffuser, and ambient lighting.",
  })
  @IsString()
  @IsNotEmpty()
  description: string
}

export class BlockedTimeTypeDto {
  @ApiProperty({ example: "Lunch Break" })
  @IsString()
  @IsNotEmpty()
  type: string

  @ApiProperty({ example: "utensils" })
  @IsString()
  @IsNotEmpty()
  typeIcon: string

  @ApiProperty({ example: "1 hour" })
  @IsString()
  @IsNotEmpty()
  duration: string

  @ApiProperty({ example: "Paid", enum: ["Paid", "Unpaid"] })
  @IsEnum(["Paid", "Unpaid"])
  compensation: string
}

export class PaymentMethodDto {
  @ApiProperty({ example: "Mastercard" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    example: "credit_card",
    enum: ["cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet"],
  })
  @IsEnum(["cash", "credit_card", "debit_card", "bank_transfer", "digital_wallet"])
  paymentType: string

  @ApiProperty({ example: true })
  @IsBoolean()
  enabled: boolean
}

export class ClosedPeriodDto {
  @ApiProperty({ example: "2025-12-25" })
  @IsString()
  @IsNotEmpty()
  startDate: string

  @ApiProperty({ example: "2025-12-26" })
  @IsString()
  @IsNotEmpty()
  endDate: string

  @ApiProperty({ example: "Christmas Holiday" })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ example: true })
  @IsBoolean()
  businessClosed: boolean

  @ApiProperty({ example: true })
  @IsBoolean()
  onlineBookingBlocked: boolean
}

export class CreateBusinessSettingsDto {
  @ApiProperty({ example: "Lola April Wellness Spa" })
  @IsString()
  @IsNotEmpty()
  businessName: string

  @ApiProperty({ example: "info@lolaaprils.com" })
  @IsEmail()
  businessEmail: string

  @ApiProperty({
    type: "object",
    properties: {
      countryCode: { type: "string", example: "+234" },
      number: { type: "string", example: "+234 123 456 7890" },
    },
  })
  @ValidateNested()
  @Type(() => Object)
  businessPhone: {
    countryCode: string
    number: string
  }

  @ApiProperty({
    type: "object",
    properties: {
      street: { type: "string", example: "11 Rasheed Alaba Williams Street" },
      city: { type: "string", example: "Lagos" },
      region: { type: "string", example: "Lagos State" },
      postcode: { type: "string", example: "101241" },
      country: { type: "string", example: "Nigeria" },
    },
  })
  @ValidateNested()
  @Type(() => Object)
  businessAddress: {
    street: string
    city: string
    region: string
    postcode: string
    country: string
  }

  @ApiProperty({ type: [BusinessHoursDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDto)
  businessHours: BusinessHoursDto[]

  @ApiPropertyOptional({ type: [AppointmentStatusDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AppointmentStatusDto)
  appointmentStatuses?: AppointmentStatusDto[]

  @ApiPropertyOptional({ type: [CancellationReasonDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CancellationReasonDto)
  cancellationReasons?: CancellationReasonDto[]

  @ApiPropertyOptional({ type: [ResourceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ResourceDto)
  resources?: ResourceDto[]

  @ApiPropertyOptional({ type: [BlockedTimeTypeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BlockedTimeTypeDto)
  blockedTimeTypes?: BlockedTimeTypeDto[]

  @ApiPropertyOptional({ type: [PaymentMethodDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PaymentMethodDto)
  paymentMethods?: PaymentMethodDto[]

  @ApiPropertyOptional({ type: [ClosedPeriodDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ClosedPeriodDto)
  closedPeriods?: ClosedPeriodDto[]

  @ApiPropertyOptional({ example: "NGN" })
  @IsOptional()
  @IsString()
  defaultCurrency?: string

  @ApiPropertyOptional({ example: "Africa/Lagos" })
  @IsOptional()
  @IsString()
  timezone?: string

  @ApiPropertyOptional({ example: 15 })
  @IsOptional()
  @IsNumber()
  defaultAppointmentDuration?: number

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  bookingWindowHours?: number

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  allowOnlineBooking?: boolean

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  requireClientConfirmation?: boolean
}
