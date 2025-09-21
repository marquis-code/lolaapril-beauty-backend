import { IsString, IsNumber, IsOptional } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class CurrencyDto {
  @ApiProperty({ example: "NGN" })
  @IsString()
  currency: string

  @ApiProperty({ example: 5000 })
  @IsNumber()
  amount: number
}

export class DurationDto {
  @ApiProperty({ example: 30 })
  @IsNumber()
  value: number

  @ApiProperty({ example: "min", enum: ["min", "h", "day"] })
  @IsString()
  unit: "min" | "h" | "day"
}

export class PhoneDto {
  @ApiProperty({ example: "+234" })
  @IsString()
  countryCode: string

  @ApiProperty({ example: "+1234 567 8901" })
  @IsString()
  number: string
}

export class AddressDto {
  @ApiPropertyOptional({ example: "Home" })
  @IsOptional()
  @IsString()
  addressName?: string

  @ApiPropertyOptional({ example: "Home" })
  @IsOptional()
  @IsString()
  addressType?: string

  @ApiProperty({ example: "123 Main Street" })
  @IsString()
  street: string

  @ApiPropertyOptional({ example: "Apt 4B" })
  @IsOptional()
  @IsString()
  aptSuite?: string

  @ApiPropertyOptional({ example: "Victoria Island" })
  @IsOptional()
  @IsString()
  district?: string

  @ApiProperty({ example: "Lagos" })
  @IsString()
  city: string

  @ApiProperty({ example: "Lagos State" })
  @IsString()
  region: string

  @ApiProperty({ example: "101241" })
  @IsString()
  postcode: string

  @ApiProperty({ example: "Nigeria" })
  @IsString()
  country: string
}
