import {
  IsString,
  IsNotEmpty,
  IsOptional,
  ValidateNested,
  IsArray,
  IsNumber,
  IsEnum,
  IsDateString,
} from "class-validator"
import { Type } from "class-transformer"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class BookingServiceDto {
  @ApiProperty({ example: "service_001" })
  @IsString()
  @IsNotEmpty()
  serviceId: string

  @ApiProperty({ example: "Hair Cut" })
  @IsString()
  @IsNotEmpty()
  serviceName: string

  @ApiProperty({ example: 60 })
  @IsNumber()
  duration: number

  @ApiProperty({ example: 5000 })
  @IsNumber()
  price: number

  @ApiPropertyOptional({ example: "staff_001" })
  @IsOptional()
  @IsString()
  staffId?: string

  @ApiPropertyOptional({ example: "John Doe" })
  @IsOptional()
  @IsString()
  staffName?: string
}

export class CreateBookingDto {
  @ApiProperty({ example: "507f1f77bcf86cd799439011" })
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiProperty({ type: [BookingServiceDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BookingServiceDto)
  services: BookingServiceDto[]

  @ApiProperty({ example: "2025-09-21T00:00:00.000Z" })
  @IsDateString()
  bookingDate: Date

  @ApiProperty({ example: "09:00" })
  @IsString()
  @IsNotEmpty()
  startTime: string

  @ApiProperty({ example: "11:00" })
  @IsString()
  @IsNotEmpty()
  endTime: string

  @ApiProperty({ example: 120 })
  @IsNumber()
  totalDuration: number

  @ApiProperty({ example: 15000 })
  @IsNumber()
  totalAmount: number

  @ApiPropertyOptional({
    example: "pending",
    enum: ["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"],
  })
  @IsOptional()
  @IsEnum(["pending", "confirmed", "in_progress", "completed", "cancelled", "no_show"])
  status?: string

  @ApiPropertyOptional({
    example: "online",
    enum: ["online", "phone", "walk_in", "admin"],
  })
  @IsOptional()
  @IsEnum(["online", "phone", "walk_in", "admin"])
  bookingSource?: string

  @ApiPropertyOptional({ example: "Please use organic products only" })
  @IsOptional()
  @IsString()
  specialRequests?: string

  @ApiPropertyOptional({ example: "Client is a regular customer" })
  @IsOptional()
  @IsString()
  internalNotes?: string

  @ApiPropertyOptional({ example: "507f1f77bcf86cd799439012" })
  @IsOptional()
  @IsString()
  createdBy?: string
}
