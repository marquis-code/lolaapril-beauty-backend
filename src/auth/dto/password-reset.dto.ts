import { IsEmail, IsString, MinLength, IsNotEmpty, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ForgotPasswordDto {
  @ApiProperty({ 
    example: 'business@example.com',
    description: 'Email address of the business account'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class VerifyResetOTPDto {
  @ApiProperty({ 
    example: 'business@example.com',
    description: 'Email address of the business account'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: '123456',
    description: '6-digit OTP code'
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must contain only numbers' })
  otp: string;
}

export class ResetPasswordDto {
  @ApiProperty({ 
    example: 'business@example.com',
    description: 'Email address of the business account'
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ 
    example: '123456',
    description: '6-digit OTP code'
  })
  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  @Matches(/^\d{6}$/, { message: 'OTP must contain only numbers' })
  otp: string;

  @ApiProperty({ 
    example: 'NewSecurePassword123!',
    description: 'New password (minimum 8 characters with uppercase, lowercase, number, and special character)'
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/,
    { message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character' }
  )
  @IsNotEmpty()
  newPassword: string;
}
