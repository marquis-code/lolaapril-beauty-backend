
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

// ==================== NESTED DTOs ====================

export class BusinessPhoneDto {
  @ApiProperty({ example: "+234", description: "Country code" })
  @IsString()
  @IsNotEmpty()
  countryCode: string

  @ApiProperty({ example: "08147626503", description: "Phone number" })
  @IsString()
  @IsNotEmpty()
  number: string
}

export class BusinessAddressDto {
  @ApiProperty({ example: "18, Alubarika street ijeshatedo" })
  @IsString()
  @IsNotEmpty()
  street: string

  @ApiProperty({ example: "surulere" })
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty({ example: "Lagos" })
  @IsString()
  @IsNotEmpty()
  region: string

  @ApiProperty({ example: "101282" })
  @IsString()
  @IsNotEmpty()
  postcode: string

  @ApiProperty({ example: "Nigeria" })
  @IsString()
  @IsNotEmpty()
  country: string
}

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

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
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

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
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

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
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

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
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

export class ServiceChargeBasicInfoDto {
  @ApiProperty({ example: "Service Charge" })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({ example: "Standard service charge" })
  @IsString()
  @IsNotEmpty()
  description: string
}

export class ServiceChargeSettingsDto {
  @ApiProperty({ example: "All services" })
  @IsString()
  @IsNotEmpty()
  applyServiceChargeOn: string

  @ApiProperty({ example: false })
  @IsBoolean()
  automaticallyApplyDuringCheckout: boolean
}

export class AmountDto {
  @ApiProperty({ example: "NGN" })
  @IsString()
  @IsNotEmpty()
  currency: string

  @ApiProperty({ example: 1000 })
  @IsNumber()
  value: number
}

export class RateTypeDto {
  @ApiProperty({ example: "Percentage", enum: ["Flat rate", "Percentage", "Both"] })
  @IsEnum(["Flat rate", "Percentage", "Both"])
  type: string

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => AmountDto)
  amount?: AmountDto

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @IsNumber()
  percentage?: number

  @ApiPropertyOptional()
  @IsOptional()
  @ValidateNested()
  @Type(() => AmountDto)
  flatRate?: AmountDto
}

export class TaxRateDto {
  @ApiProperty({ example: "VAT" })
  @IsString()
  @IsNotEmpty()
  tax: string

  @ApiProperty({ example: 7.5 })
  @IsNumber()
  rate: number
}

export class ServiceChargeDto {
  @ApiProperty()
  @ValidateNested()
  @Type(() => ServiceChargeBasicInfoDto)
  basicInfo: ServiceChargeBasicInfoDto

  @ApiProperty()
  @ValidateNested()
  @Type(() => ServiceChargeSettingsDto)
  settings: ServiceChargeSettingsDto

  @ApiProperty()
  @ValidateNested()
  @Type(() => RateTypeDto)
  rateType: RateTypeDto

  @ApiProperty()
  @ValidateNested()
  @Type(() => TaxRateDto)
  taxRate: TaxRateDto

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
}

export class TaxDto {
  @ApiProperty({ example: "VAT" })
  @IsString()
  @IsNotEmpty()
  taxName: string

  @ApiProperty({ example: 7.5 })
  @IsNumber()
  taxRate: number

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean
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
  // ✅ NOTE: businessId is NOT in the DTO
  // It's automatically extracted from JWT token via @BusinessId() decorator

  @ApiProperty({ example: "Safemom" })
  @IsString()
  @IsNotEmpty()
  businessName: string

  @ApiProperty({ example: "info@safemom.com" })
  @IsEmail()
  @IsNotEmpty()
  businessEmail: string

  @ApiProperty({ type: BusinessPhoneDto })
  @ValidateNested()
  @Type(() => BusinessPhoneDto) // ✅ CRITICAL for nested validation
  businessPhone: BusinessPhoneDto

  @ApiProperty({ type: BusinessAddressDto })
  @ValidateNested()
  @Type(() => BusinessAddressDto) // ✅ CRITICAL for nested validation
  businessAddress: BusinessAddressDto

  @ApiProperty({ type: [BusinessHoursDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDto) // ✅ CRITICAL for array validation
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

  @ApiPropertyOptional({ type: [ServiceChargeDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ServiceChargeDto)
  serviceCharges?: ServiceChargeDto[]

  @ApiPropertyOptional({ type: [TaxDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TaxDto)
  taxes?: TaxDto[]

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

  @ApiPropertyOptional({ example: 30 })
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