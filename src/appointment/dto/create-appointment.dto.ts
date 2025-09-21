import { IsString, IsNotEmpty, IsOptional, ValidateNested, IsArray, IsNumber, IsEnum, MaxLength } from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class BusinessInfoDto {
  @ApiProperty({ example: "lola_april_wellness_spa" })
  @IsString()
  @IsNotEmpty()
  businessId: string

  @ApiProperty({ example: "Lola April Wellness Spa" })
  @IsString()
  @IsNotEmpty()
  businessName: string

  @ApiPropertyOptional({ example: 4.9 })
  @IsOptional()
  @IsNumber()
  rating?: number

  @ApiPropertyOptional({ example: 45 })
  @IsOptional()
  @IsNumber()
  reviewCount?: number

  @ApiProperty({ example: "11 Rasheed Alaba Williams Street, Lekki Phase 1, Lagos" })
  @IsString()
  @IsNotEmpty()
  address: string
}

export class DurationDto {
  @ApiProperty({ example: 2 })
  @IsNumber()
  hours: number

  @ApiProperty({ example: 45 })
  @IsNumber()
  minutes: number
}

export class PriceDto {
  @ApiProperty({ example: "NGN" })
  @IsString()
  @IsNotEmpty()
  currency: string

  @ApiProperty({ example: 130000 })
  @IsNumber()
  amount: number
}

export class SelectedOptionDto {
  @ApiProperty({ example: "dear_mum_special" })
  @IsString()
  @IsNotEmpty()
  optionId: string

  @ApiProperty({ example: "Dear Mum: You're Special" })
  @IsString()
  @IsNotEmpty()
  optionName: string

  @ApiProperty({ type: DurationDto })
  @ValidateNested()
  @Type(() => DurationDto)
  duration: DurationDto

  @ApiProperty({ example: "We welcome her with a refreshing drink & a complimentary card from you." })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ type: PriceDto })
  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto
}

export class AdditionalServiceDto {
  @ApiProperty({ example: "infrared_therapy" })
  @IsString()
  @IsNotEmpty()
  serviceId: string

  @ApiProperty({ example: "Infrared Therapy" })
  @IsString()
  @IsNotEmpty()
  serviceName: string

  @ApiProperty({ type: DurationDto })
  @ValidateNested()
  @Type(() => DurationDto)
  duration: DurationDto

  @ApiProperty({ example: "Penetrates deeper into the muscles & joints to reduce inflammation and pain." })
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ type: PriceDto })
  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto
}

export class SelectedServiceDto {
  @ApiProperty({ example: "dear_mum_series" })
  @IsString()
  @IsNotEmpty()
  serviceId: string

  @ApiProperty({ example: "Dear Mum Series" })
  @IsString()
  @IsNotEmpty()
  serviceName: string

  @ApiProperty({ example: "bundle" })
  @IsString()
  @IsNotEmpty()
  serviceType: string

  @ApiProperty({ type: SelectedOptionDto })
  @ValidateNested()
  @Type(() => SelectedOptionDto)
  selectedOption: SelectedOptionDto

  @ApiPropertyOptional({ type: [AdditionalServiceDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AdditionalServiceDto)
  additionalServices?: AdditionalServiceDto[]
}

export class AppointmentDetailsDto {
  @ApiProperty({ example: "2025-09-21" })
  @IsString()
  @IsNotEmpty()
  date: string

  @ApiProperty({ example: "Sunday" })
  @IsString()
  @IsNotEmpty()
  dayOfWeek: string

  @ApiProperty({ example: "18:00" })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ example: "20:45" })
  @IsString()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({ example: "2 hrs, 45 mins duration" })
  @IsString()
  @IsNotEmpty()
  duration: string
}

export class ServiceDetailsDto {
  @ApiProperty({ example: "Dear Mum Series" })
  @IsString()
  @IsNotEmpty()
  serviceName: string

  @ApiProperty({ example: "Dear Mum: You're Special with any professional" })
  @IsString()
  @IsNotEmpty()
  serviceDescription: string

  @ApiProperty({ type: PriceDto })
  @ValidateNested()
  @Type(() => PriceDto)
  price: PriceDto
}

export class PaymentStatusDto {
  @ApiProperty({ type: PriceDto })
  @ValidateNested()
  @Type(() => PriceDto)
  payNow: PriceDto

  @ApiProperty({ type: PriceDto })
  @ValidateNested()
  @Type(() => PriceDto)
  payAtVenue: PriceDto
}

export class TaxDto {
  @ApiProperty({ example: "NGN" })
  @IsString()
  @IsNotEmpty()
  currency: string

  @ApiProperty({ example: 9750 })
  @IsNumber()
  amount: number

  @ApiProperty({ example: 7.5 })
  @IsNumber()
  rate: number
}

export class PaymentDetailsDto {
  @ApiProperty({ example: "Pay at venue" })
  @IsString()
  @IsNotEmpty()
  paymentMethod: string

  @ApiProperty({ type: PriceDto })
  @ValidateNested()
  @Type(() => PriceDto)
  subtotal: PriceDto

  @ApiProperty({ type: TaxDto })
  @ValidateNested()
  @Type(() => TaxDto)
  tax: TaxDto

  @ApiProperty({ type: PriceDto })
  @ValidateNested()
  @Type(() => PriceDto)
  total: PriceDto

  @ApiProperty({ type: PaymentStatusDto })
  @ValidateNested()
  @Type(() => PaymentStatusDto)
  paymentStatus: PaymentStatusDto
}

export class PaymentInstructionsDto {
  @ApiPropertyOptional({ example: "https://paystack.com/pay/qthu-d1gcx" })
  @IsOptional()
  @IsString()
  paymentUrl?: string

  @ApiProperty({
    example:
      "Appointments are confirmed upon payment. Unconfirmed appointments will be released after 2 hours from the time of booking.",
  })
  @IsString()
  @IsNotEmpty()
  confirmationPolicy: string
}

export class CreateAppointmentDto {
  @ApiProperty({ example: "507f1f77bcf86cd799439011" })
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiProperty({ type: BusinessInfoDto })
  @ValidateNested()
  @Type(() => BusinessInfoDto)
  businessInfo: BusinessInfoDto

  @ApiProperty({ type: [SelectedServiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SelectedServiceDto)
  selectedServices: SelectedServiceDto[]

  @ApiProperty({ type: DurationDto })
  @ValidateNested()
  @Type(() => DurationDto)
  totalDuration: DurationDto

  @ApiProperty({ example: "2025-09-21" })
  @IsString()
  @IsNotEmpty()
  selectedDate: string

  @ApiProperty({ example: "18:00" })
  @IsString()
  @IsNotEmpty()
  selectedTime: string

  @ApiProperty({ type: AppointmentDetailsDto })
  @ValidateNested()
  @Type(() => AppointmentDetailsDto)
  appointmentDetails: AppointmentDetailsDto

  @ApiProperty({ type: ServiceDetailsDto })
  @ValidateNested()
  @Type(() => ServiceDetailsDto)
  serviceDetails: ServiceDetailsDto

  @ApiProperty({ type: PaymentDetailsDto })
  @ValidateNested()
  @Type(() => PaymentDetailsDto)
  paymentDetails: PaymentDetailsDto

  @ApiPropertyOptional({ type: PaymentInstructionsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => PaymentInstructionsDto)
  paymentInstructions?: PaymentInstructionsDto

  @ApiPropertyOptional({ example: "Please ensure the room is well ventilated", maxLength: 500 })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  customerNotes?: string

  @ApiPropertyOptional({
    example: "pending_confirmation",
    enum: ["pending_confirmation", "confirmed", "in_progress", "completed", "cancelled", "no_show"],
  })
  @IsOptional()
  @IsEnum(["pending_confirmation", "confirmed", "in_progress", "completed", "cancelled", "no_show"])
  status?: string

  @ApiPropertyOptional({ example: "507f1f77bcf86cd799439012" })
  @IsOptional()
  @IsString()
  assignedStaff?: string
}
