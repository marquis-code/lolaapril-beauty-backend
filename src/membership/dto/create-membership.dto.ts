import { IsString, IsNumber, IsArray, IsOptional, IsBoolean, IsObject } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import type { Types } from "mongoose"

export class CreateMembershipDto {
  @ApiProperty({ description: "Membership name" })
  @IsString()
  name: string

  @ApiProperty({ description: "Membership description" })
  @IsString()
  description: string

  @ApiProperty({ description: "Membership price" })
  @IsNumber()
  price: number

  @ApiProperty({ description: "Currency code", default: "USD" })
  @IsString()
  currency: string

  @ApiProperty({ description: "Duration in days" })
  @IsNumber()
  duration: number

  @ApiProperty({ description: "Included service IDs", type: [String] })
  @IsArray()
  includedServices: Types.ObjectId[]

  @ApiProperty({ description: "Discount percentage", required: false })
  @IsOptional()
  @IsNumber()
  discountPercentage?: number

  @ApiProperty({ description: "Maximum bookings allowed", required: false })
  @IsOptional()
  @IsNumber()
  maxBookings?: number

  @ApiProperty({ description: "Auto renewal enabled", required: false })
  @IsOptional()
  @IsBoolean()
  autoRenewal?: boolean

  @ApiProperty({ description: "Membership benefits", required: false })
  @IsOptional()
  @IsObject()
  benefits?: {
    priorityBooking: boolean
    discountOnProducts: number
    freeServices: string[]
    additionalPerks: string[]
  }
}

export class PurchaseMembershipDto {
  @ApiProperty({ description: "Client ID" })
  @IsString()
  clientId: Types.ObjectId

  @ApiProperty({ description: "Membership ID" })
  @IsString()
  membershipId: Types.ObjectId

  @ApiProperty({ description: "Auto renewal preference", required: false })
  @IsOptional()
  @IsBoolean()
  autoRenewal?: boolean
}
