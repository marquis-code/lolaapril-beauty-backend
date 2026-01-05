import { IsString, IsOptional, IsBoolean, IsEnum, IsObject, ValidateNested, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

export enum WidgetDisplayType {
  MODAL = 'modal',
  INLINE = 'inline',
  POPUP = 'popup',
  SIDEBAR = 'sidebar'
}

export enum WidgetTheme {
  LIGHT = 'light',
  DARK = 'dark',
  CUSTOM = 'custom'
}

class WidgetConfiguration {
  @ApiProperty({ 
    enum: WidgetDisplayType,
    example: WidgetDisplayType.MODAL,
    description: 'How the widget is displayed'
  })
  @IsEnum(WidgetDisplayType)
  displayType: WidgetDisplayType;

  @ApiProperty({ 
    example: 'Book Now',
    description: 'Text on the booking button'
  })
  @IsString()
  buttonText: string;

  @ApiProperty({ 
    example: '#3B82F6',
    description: 'Button color (hex)'
  })
  @IsString()
  buttonColor: string;

  @ApiProperty({ 
    example: true,
    description: 'Show "Powered by" branding'
  })
  @IsBoolean()
  showBranding: boolean;

  @ApiPropertyOptional({ 
    example: ['https://example.com', 'https://www.example.com'],
    description: 'Allowed origins for CORS'
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allowedOrigins?: string[];
}

class WidgetStyling {
  @ApiProperty({ 
    enum: WidgetTheme,
    example: WidgetTheme.LIGHT,
    description: 'Widget theme'
  })
  @IsEnum(WidgetTheme)
  theme: WidgetTheme;

  @ApiProperty({ 
    example: '#3B82F6',
    description: 'Primary color for the widget'
  })
  @IsString()
  primaryColor: string;

  @ApiProperty({ 
    example: '8px',
    description: 'Border radius'
  })
  @IsString()
  borderRadius: string;

  @ApiProperty({ 
    example: '14px',
    description: 'Font size'
  })
  @IsString()
  fontSize: string;
}

export class CreateWidgetDto {
  @ApiPropertyOptional({ 
    example: 'Homepage Widget',
    description: 'Widget name for internal reference'
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ 
    type: WidgetConfiguration,
    description: 'Widget configuration options'
  })
  @IsObject()
  @ValidateNested()
  @Type(() => WidgetConfiguration)
  configuration: WidgetConfiguration;

  @ApiProperty({ 
    type: WidgetStyling,
    description: 'Widget styling options'
  })
  @IsObject()
  @ValidateNested()
  @Type(() => WidgetStyling)
  styling: WidgetStyling;
}

export class UpdateWidgetDto extends PartialType(CreateWidgetDto) {
  @ApiPropertyOptional({ 
    description: 'Set widget as active or inactive',
    example: true
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}