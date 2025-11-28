// src/modules/booking/dto/create-booking.dto.ts
import { IsString, IsNotEmpty, IsArray, IsOptional, IsNumber, Min } from 'class-validator'

export class ServiceBookingDto {
  @IsString()
  @IsNotEmpty()
  serviceId: string

  @IsNumber()
  @IsOptional()
  @Min(0)
  bufferTime?: number // Optional buffer time for this service
}

export class CreateBookingDto {
  @IsString()
  @IsNotEmpty()
  businessId: string

  @IsString()
  @IsNotEmpty()
  clientId: string

  @IsArray()
  @IsNotEmpty()
  services: ServiceBookingDto[] // Updated to include buffer time

  @IsString()
  @IsNotEmpty()
  preferredDate: string

  @IsString()
  @IsNotEmpty()
  preferredStartTime: string

  @IsString()
  @IsNotEmpty()
  clientName: string

  @IsString()
  @IsNotEmpty()
  clientEmail: string

  @IsString()
  @IsNotEmpty()
  clientPhone: string

  @IsString()
  @IsOptional()
  specialRequests?: string

  @IsNumber()
  @IsOptional()
  @Min(0)
  additionalBufferTime?: number // Optional additional buffer time
}