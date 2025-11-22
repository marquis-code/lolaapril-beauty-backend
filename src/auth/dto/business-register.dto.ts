import { IsString, IsEmail, IsEnum, IsOptional, ValidateNested, MinLength } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

class BusinessOwnerDto {
  @ApiProperty({ description: 'Owner first name' })
  @IsString()
  firstName: string

  @ApiProperty({ description: 'Owner last name' })
  @IsString()
  lastName: string

  @ApiProperty({ description: 'Owner email address' })
  @IsEmail()
  email: string

  @ApiProperty({ description: 'Owner phone number' })
  @IsString()
  phone: string

  @ApiProperty({ description: 'Password', minLength: 6 })
  @IsString()
  @MinLength(6)
  password: string
}

class BusinessAddressDto {
  @ApiProperty()
  @IsString()
  street: string

  @ApiProperty()
  @IsString()
  city: string

  @ApiProperty()
  @IsString()
  state: string

  @ApiProperty()
  @IsString()
  country: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  postalCode?: string
}

class BusinessContactDto {
  @ApiProperty()
  @IsString()
  primaryPhone: string

  @ApiProperty()
  @IsEmail()
  email: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  website?: string
}

export class BusinessRegisterDto {
  @ApiProperty({ description: 'Business owner details', type: BusinessOwnerDto })
  @ValidateNested()
  @Type(() => BusinessOwnerDto)
  owner: BusinessOwnerDto

  @ApiProperty({ description: 'Business name' })
  @IsString()
  businessName: string

  @ApiProperty({ description: 'Unique subdomain for the business' })
  @IsString()
  subdomain: string

  @ApiProperty({ 
    description: 'Type of business',
    enum: ['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other'] 
  })
  @IsEnum(['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other'])
  businessType: string

  @ApiPropertyOptional({ description: 'Business description' })
  @IsOptional()
  @IsString()
  businessDescription?: string

  @ApiProperty({ description: 'Business address', type: BusinessAddressDto })
  @ValidateNested()
  @Type(() => BusinessAddressDto)
  address: BusinessAddressDto

  @ApiProperty({ description: 'Business contact', type: BusinessContactDto })
  @ValidateNested()
  @Type(() => BusinessContactDto)
  contact: BusinessContactDto
}

export class BusinessLoginDto {
  @ApiProperty({ description: 'Business owner email address' })
  @IsEmail()
  email: string

  @ApiProperty({ description: 'Password' })
  @IsString()
  password: string

  @ApiPropertyOptional({ description: 'Business subdomain (optional for login)' })
  @IsOptional()
  @IsString()
  subdomain?: string
}

export class GoogleAuthDto {
  @ApiProperty({ description: 'Google OAuth ID token' })
  @IsString()
  idToken: string

  @ApiPropertyOptional({ description: 'Business subdomain (for business login)' })
  @IsOptional()
  @IsString()
  subdomain?: string
}