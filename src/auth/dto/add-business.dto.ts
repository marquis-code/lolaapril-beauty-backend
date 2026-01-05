import { IsString, IsEnum, IsOptional, ValidateNested, MinLength, IsEmail } from 'class-validator'
import { Type } from 'class-transformer'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'

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

export class AddBusinessDto {
  @ApiProperty({ description: 'Business name', example: 'My New Salon' })
  @IsString()
  @MinLength(2)
  businessName: string

  @ApiProperty({ description: 'Unique subdomain', example: 'my-new-salon' })
  @IsString()
  @MinLength(3)
  subdomain: string

  @ApiProperty({ 
    description: 'Type of business',
    enum: ['salon', 'spa', 'barbershop', 'beauty_clinic', 'wellness_center', 'other'],
    example: 'salon'
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