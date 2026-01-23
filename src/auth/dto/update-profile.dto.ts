// src/modules/auth/dto/update-profile.dto.ts
import { IsString, IsEmail, IsOptional, IsDateString, IsEnum, MinLength, MaxLength, IsBoolean, ValidateNested } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'

// Define nested classes first (dependencies)
export class NotificationPreferencesDto {
  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  email?: boolean

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  sms?: boolean

  @ApiProperty({ required: false, example: true })
  @IsOptional()
  @IsBoolean()
  push?: boolean
}

export class UserPreferencesDto {
  @ApiProperty({ required: false, example: 'en' })
  @IsOptional()
  @IsString()
  language?: string

  @ApiProperty({ required: false, example: 'Africa/Lagos' })
  @IsOptional()
  @IsString()
  timezone?: string

  @ApiProperty({ required: false, example: 'NGN' })
  @IsOptional()
  @IsString()
  currency?: string

  @ApiProperty({ required: false, type: NotificationPreferencesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => NotificationPreferencesDto)
  notifications?: NotificationPreferencesDto
}

// Main UpdateProfileDto
export class UpdateProfileDto {
  @ApiProperty({ required: false, example: 'John' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  firstName?: string

  @ApiProperty({ required: false, example: 'Doe' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  lastName?: string

  @ApiProperty({ required: false, example: '+2348012345678' })
  @IsOptional()
  @IsString()
  phone?: string

  @ApiProperty({ required: false, example: 'https://example.com/profile.jpg' })
  @IsOptional()
  @IsString()
  profileImage?: string

  @ApiProperty({ required: false, example: 'Passionate about creating beautiful experiences' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string

  @ApiProperty({ required: false, example: '1990-01-01' })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string

  @ApiProperty({ required: false, enum: ['male', 'female', 'other', 'prefer_not_to_say'] })
  @IsOptional()
  @IsEnum(['male', 'female', 'other', 'prefer_not_to_say'])
  gender?: string

  @ApiProperty({ required: false, type: UserPreferencesDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => UserPreferencesDto)
  preferences?: UserPreferencesDto
}

export class ChangePasswordDto {
  @ApiProperty({ required: true, example: 'currentPassword123' })
  @IsString()
  @MinLength(6)
  currentPassword: string

  @ApiProperty({ required: true, example: 'newPassword123' })
  @IsString()
  @MinLength(6)
  @MaxLength(128)
  newPassword: string

  @ApiProperty({ required: true, example: 'newPassword123' })
  @IsString()
  confirmPassword: string
}

export class UpdateEmailDto {
  @ApiProperty({ required: true, example: 'newemail@example.com' })
  @IsEmail()
  newEmail: string

  @ApiProperty({ required: true, example: 'currentPassword123' })
  @IsString()
  @MinLength(6)
  password: string
}