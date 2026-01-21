// import { IsString, IsNotEmpty, IsNumber, IsEmail, IsOptional, Min } from "class-validator"
// import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

// export class InitializePaymentDto {
//   @ApiProperty({ example: "client@example.com", description: "Client email address" })
//   @IsEmail()
//   @IsNotEmpty()
//   email: string

//   @ApiProperty({ example: 5000, description: "Payment amount in Naira" })
//   @IsNumber()
//   @Min(100)
//   amount: number

//   @ApiProperty({ example: "507f1f77bcf86cd799439011", description: "Client ID" })
//   @IsString()
//   @IsNotEmpty()
//   clientId: string

//   @ApiPropertyOptional({ example: "507f1f77bcf86cd799439012", description: "Appointment ID" })
//   @IsOptional()
//   @IsString()
//   appointmentId?: string

//   @ApiPropertyOptional({ example: "507f1f77bcf86cd799439013", description: "Booking ID" })
//   @IsOptional()
//   @IsString()
//   bookingId?: string

//   @ApiPropertyOptional({ 
//     description: "Additional metadata for the payment",
//     example: { businessId: "507f1f77bcf86cd799439014", serviceName: "Hair Cut" }
//   })
//   @IsOptional()
//   metadata?: any
// }

import { IsString, IsNotEmpty, IsNumber, IsEmail, IsOptional, Min } from "class-validator"
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger"

export class InitializePaymentDto {
  @ApiProperty({ example: "client@example.com", description: "Client email address" })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({ example: 5000, description: "Payment amount in Naira" })
  @IsNumber()
  @Min(100)
  amount: number

  @ApiProperty({ example: "507f1f77bcf86cd799439011", description: "Client ID" })
  @IsString()
  @IsNotEmpty()
  clientId: string

  @ApiPropertyOptional({ example: "507f1f77bcf86cd799439014", description: "Business ID (provide either businessId or subdomain)" })
  @IsOptional()
  @IsString()
  businessId?: string

  @ApiPropertyOptional({ example: "luxebeauty", description: "Business subdomain (provide either businessId or subdomain)" })
  @IsOptional()
  @IsString()
  subdomain?: string

  @ApiPropertyOptional({ example: "507f1f77bcf86cd799439012", description: "Appointment ID" })
  @IsOptional()
  @IsString()
  appointmentId?: string

  @ApiPropertyOptional({ example: "507f1f77bcf86cd799439013", description: "Booking ID" })
  @IsOptional()
  @IsString()
  bookingId?: string

  @ApiPropertyOptional({ 
    example: "paystack", 
    description: "Payment gateway to use (paystack, flutterwave, etc.)",
    enum: ["paystack", "flutterwave", "stripe"]
  })
  @IsOptional()
  @IsString()
  gateway?: string

  @ApiPropertyOptional({ 
    description: "Additional metadata for the payment",
    example: { 
      services: [
        { serviceId: "507f1f77bcf86cd799439015", serviceName: "Hair Cut", price: 5000 }
      ],
      businessName: "Beauty Salon"
    }
  })
  @IsOptional()
  metadata?: any
}