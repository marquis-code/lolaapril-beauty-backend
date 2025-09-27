import { IsNotEmpty, IsDateString, IsString, IsArray, IsOptional, IsBoolean, IsEmail, IsPhoneNumber } from 'class-validator'

export class CreateBookingDto {
  @IsNotEmpty()
  @IsString()
  businessId: string

  @IsNotEmpty()
  @IsString()
  clientId: string

  @IsNotEmpty()
  @IsArray()
  serviceIds: string[]

  @IsNotEmpty()
  @IsDateString()
  preferredDate: Date

  @IsNotEmpty()
  @IsString()
  preferredStartTime: string

  @IsNotEmpty()
  @IsString()
  clientName: string

  @IsNotEmpty()
  @IsEmail()
  clientEmail: string

  @IsNotEmpty()
  @IsPhoneNumber('NG') // Nigerian phone numbers
  clientPhone: string

  @IsOptional()
  @IsString()
  specialRequests?: string

  @IsOptional()
  @IsBoolean()
  autoConfirm?: boolean
}