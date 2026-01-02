// src/modules/booking/dto/process-payment.dto.ts
import { IsNotEmpty, IsString, IsNumber, IsIn, IsOptional, IsEnum, IsBoolean } from 'class-validator'

export class ProcessPaymentDto {

    @IsOptional()
    @IsEnum(['full', 'deposit', 'remaining'])
    paymentType?: 'full' | 'deposit' | 'remaining'
  
    @IsOptional()
    @IsNumber()
    depositAmount?: number

  @IsNotEmpty()
  @IsString()
  bookingId: string

  @IsNotEmpty()
  @IsString()
  transactionReference: string

  @IsNotEmpty()
  @IsNumber()
  amount: number

  @IsNotEmpty()
  @IsString()
  paymentMethod: string

  @IsNotEmpty()
  @IsString()
  gateway: string

  @IsNotEmpty()
  @IsString()
  clientId: string // ADDED

  @IsNotEmpty()
  @IsString()
  businessId: string // ADDED

  @IsNotEmpty()
  @IsIn(['successful', 'failed'])
  status: 'successful' | 'failed'

  @IsOptional()
  @IsBoolean()
  captureNow?: boolean // For deposit capture at booking time
}