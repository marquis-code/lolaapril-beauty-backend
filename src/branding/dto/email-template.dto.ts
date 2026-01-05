import { IsString, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export enum EmailTemplateType {
  BOOKING_CONFIRMATION = 'booking_confirmation',
  BOOKING_REMINDER = 'booking_reminder',
  BOOKING_CANCELLATION = 'booking_cancellation',
  WELCOME = 'welcome',
  PASSWORD_RESET = 'password_reset',
  INVOICE = 'invoice',
  RECEIPT = 'receipt',
  CUSTOM = 'custom'
}

export class CreateEmailTemplateDto {
  @ApiProperty({ 
    enum: EmailTemplateType,
    description: 'Type of email template',
    example: EmailTemplateType.BOOKING_CONFIRMATION
  })
  @IsEnum(EmailTemplateType)
  templateType: EmailTemplateType | string;

  @ApiProperty({ 
    example: 'Booking Confirmed - {{businessName}}',
    description: 'Email subject line (can include variables like {{businessName}})'
  })
  @IsString()
  subject: string;

  @ApiProperty({ 
    example: '<h1>Hello {{clientName}}</h1><p>Your booking is confirmed!</p>',
    description: 'HTML content of the email (can include variables)'
  })
  @IsString()
  htmlContent: string;

  @ApiPropertyOptional({ 
    example: 'Hello {{clientName}}, Your booking is confirmed!',
    description: 'Plain text version (auto-generated if not provided)'
  })
  @IsOptional()
  @IsString()
  textContent?: string;
}

export class UpdateEmailTemplateDto extends PartialType(CreateEmailTemplateDto) {
  @ApiPropertyOptional({ 
    description: 'Set template as active or inactive',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}