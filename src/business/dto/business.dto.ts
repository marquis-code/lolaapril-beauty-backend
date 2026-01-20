// src/modules/tenant/dto/business.dto.ts
import { IsString, IsOptional, IsEnum, IsEmail, IsUrl, IsNumber, IsBoolean, ValidateNested, IsArray, IsDateString, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

class BusinessHoursDto {
  @ApiProperty()
  @IsString()
  day: string;

  @ApiProperty()
  @IsBoolean()
  isOpen: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  openTime?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  closeTime?: string;
}

class BusinessAddressDto {
  @ApiProperty()
  @IsString()
  street: string;

  @ApiProperty()
  @IsString()
  city: string;

  @ApiProperty()
  @IsString()
  state: string;

  @ApiProperty()
  @IsString()
  country: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  longitude?: number;
}

class SocialMediaDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  instagram?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  twitter?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  tiktok?: string;
}

class BusinessContactDto {
  @ApiProperty()
  @IsString()
  primaryPhone: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  secondaryPhone?: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiPropertyOptional({ type: SocialMediaDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => SocialMediaDto)
  socialMedia?: SocialMediaDto;
}

class NotificationSettingsDto {
  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  booking_confirmation?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  payment_reminders?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  appointment_reminders?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  marketing?: boolean;
}

class BusinessSettingsDto {
  @ApiPropertyOptional({ default: 'Africa/Lagos' })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ default: 'NGN' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiPropertyOptional({ default: 'en' })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ default: 30 })
  @IsOptional()
  @IsNumber()
  defaultAppointmentDuration?: number;

  @ApiPropertyOptional({ default: 15 })
  @IsOptional()
  @IsNumber()
  bufferTimeBetweenAppointments?: number;

  @ApiPropertyOptional({ default: 24 })
  @IsOptional()
  @IsNumber()
  cancellationPolicyHours?: number;

  @ApiPropertyOptional({ default: 7 })
  @IsOptional()
  @IsNumber()
  advanceBookingDays?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  allowOnlineBooking?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  requireEmailVerification?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  requirePhoneVerification?: boolean;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @IsNumber()
  taxRate?: number;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @IsNumber()
  serviceCharge?: number;

  @ApiPropertyOptional({ type: NotificationSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationSettingsDto)
  notificationSettings?: NotificationSettingsDto;
}

class BankAccountDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  accountNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bankCode?: string;
}

class BusinessDocumentsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessRegistration?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  taxIdentification?: string;

  @ApiPropertyOptional({ type: BankAccountDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BankAccountDto)
  bankAccount?: BankAccountDto;
}

export class CreateBusinessDto {
  @ApiProperty()
  @IsString()
  businessName: string;

  @ApiProperty()
  @IsString()
  subdomain: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessDescription?: string;

  @ApiProperty({ enum: ['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other'] })
  @IsEnum(['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other'])
  businessType: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiProperty({ type: BusinessAddressDto })
  @ValidateNested()
  @Type(() => BusinessAddressDto)
  address: BusinessAddressDto;

  @ApiProperty({ type: BusinessContactDto })
  @ValidateNested()
  @Type(() => BusinessContactDto)
  contact: BusinessContactDto;

  @ApiPropertyOptional({ type: BusinessSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessSettingsDto)
  settings?: BusinessSettingsDto;

  @ApiProperty()
  @IsString()
  ownerId: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  adminIds?: string[];

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'suspended', 'trial'], default: 'trial' })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended', 'trial'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  trialEndsAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  activeSubscription?: string;

  @ApiPropertyOptional({ type: BusinessDocumentsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessDocumentsDto)
  businessDocuments?: BusinessDocumentsDto;
}

export class UpdateBusinessDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  businessDescription?: string;

  @ApiPropertyOptional({ enum: ['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other'] })
  @IsOptional()
  @IsEnum(['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other'])
  businessType?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUrl()
  logo?: string;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsUrl({}, { each: true })
  images?: string[];

  @ApiPropertyOptional({ type: BusinessAddressDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessAddressDto)
  address?: BusinessAddressDto;

  @ApiPropertyOptional({ type: BusinessContactDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessContactDto)
  contact?: BusinessContactDto;

  @ApiPropertyOptional({ type: BusinessSettingsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessSettingsDto)
  settings?: BusinessSettingsDto;

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  adminIds?: string[];

  @ApiPropertyOptional({ enum: ['active', 'inactive', 'suspended', 'trial'] })
  @IsOptional()
  @IsEnum(['active', 'inactive', 'suspended', 'trial'])
  status?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  trialEndsAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  activeSubscription?: string;

  @ApiPropertyOptional({ type: BusinessDocumentsDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => BusinessDocumentsDto)
  businessDocuments?: BusinessDocumentsDto;

  @ApiPropertyOptional({ type: [BusinessHoursDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BusinessHoursDto)
  businessHours?: BusinessHoursDto[];
}