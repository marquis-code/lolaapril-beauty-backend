import { IsString, IsNumber, IsDateString, IsOptional, IsMongoId } from "class-validator"
import { ApiProperty } from "@nestjs/swagger"
import type { Types } from "mongoose"

export class CreateGiftCardDto {
  @ApiProperty({ description: "Gift card amount" })
  @IsNumber()
  amount: number

  @ApiProperty({ description: "Currency code", default: "USD" })
  @IsString()
  currency: string

  @ApiProperty({ description: "Expiry date" })
  @IsDateString()
  expiryDate: string

  @ApiProperty({ description: "Client who purchased the gift card", required: false })
  @IsOptional()
  @IsMongoId()
  purchasedBy?: Types.ObjectId

  @ApiProperty({ description: "Client to whom gift card is assigned", required: false })
  @IsOptional()
  @IsMongoId()
  assignedTo?: Types.ObjectId

  @ApiProperty({ description: "Additional notes", required: false })
  @IsOptional()
  @IsString()
  notes?: string
}

export class UseGiftCardDto {
  @ApiProperty({ description: "Gift card code" })
  @IsString()
  code: string

  @ApiProperty({ description: "Amount to use" })
  @IsNumber()
  amount: number

  @ApiProperty({ description: "Booking ID" })
  @IsMongoId()
  bookingId: Types.ObjectId
}
