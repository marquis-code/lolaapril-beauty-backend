import { IsObject, IsBoolean, IsOptional, ValidateNested, IsString, IsNumber, Allow } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';

class ColorScheme {
  @ApiProperty({ example: '#3B82F6', description: 'Primary brand color' })
  @IsString()
  primary: string;

  @ApiProperty({ example: '#10B981', description: 'Secondary brand color' })
  @IsString()
  secondary: string;

  @ApiProperty({ example: '#F59E0B', description: 'Accent color' })
  @IsString()
  accent: string;

  @ApiProperty({ example: '#FFFFFF', description: 'Background color' })
  @IsString()
  background: string;

  @ApiProperty({ example: '#1F2937', description: 'Text color' })
  @IsString()
  text: string;

  @ApiProperty({ example: '#EF4444', description: 'Error color' })
  @IsString()
  error: string;

  @ApiProperty({ example: '#10B981', description: 'Success color' })
  @IsString()
  success: string;

  @Allow() // Allow MongoDB _id field to pass through
  _id?: any;
}

class Typography {
  @ApiProperty({ example: 'Inter, sans-serif', description: 'Default font family' })
  @IsString()
  fontFamily: string;

  @ApiProperty({ example: 'Inter, sans-serif', description: 'Heading font' })
  @IsString()
  headingFont: string;

  @ApiProperty({ example: 'Inter, sans-serif', description: 'Body text font' })
  @IsString()
  bodyFont: string;

  @Allow() // Allow MongoDB _id field to pass through
  _id?: any;
}

class Logo {
  @ApiProperty({ example: 'https://example.com/logo.png', description: 'Logo URL' })
  @IsString()
  url: string;

  @ApiProperty({ example: 200, description: 'Logo width in pixels' })
  @IsNumber()
  width: number;

  @ApiProperty({ example: 80, description: 'Logo height in pixels' })
  @IsNumber()
  height: number;

  @ApiProperty({ example: 'Company Logo', description: 'Logo alt text' })
  @IsString()
  alt: string;

  @Allow() // Allow MongoDB _id field to pass through
  _id?: any;
}

class Favicon {
  @ApiProperty({ example: 'https://example.com/favicon.ico', description: 'Favicon URL' })
  @IsString()
  url: string;

  @Allow() // Allow MongoDB _id field to pass through
  _id?: any;
}

class CustomCss {
  @ApiProperty({ example: false, description: 'Enable custom CSS' })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ example: '.custom-class { color: red; }', description: 'Custom CSS code' })
  @IsString()
  cssCode: string;

  @Allow() // Allow MongoDB _id field to pass through
  _id?: any;
}

export class CreateThemeDto {
  @ApiProperty({ type: ColorScheme, description: 'Color scheme configuration' })
  @IsObject()
  @ValidateNested()
  @Type(() => ColorScheme)
  colors: ColorScheme;

  @ApiProperty({ type: Typography, description: 'Typography configuration' })
  @IsObject()
  @ValidateNested()
  @Type(() => Typography)
  typography: Typography;

  @ApiPropertyOptional({ type: Logo, description: 'Logo configuration' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Logo)
  logo?: Logo;

  @ApiPropertyOptional({ type: Favicon, description: 'Favicon configuration' })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => Favicon)
  favicon?: Favicon;

  @ApiProperty({ type: CustomCss, description: 'Custom CSS configuration' })
  @IsObject()
  @ValidateNested()
  @Type(() => CustomCss)
  customCss: CustomCss;
}

export class UpdateThemeDto extends PartialType(CreateThemeDto) {}
