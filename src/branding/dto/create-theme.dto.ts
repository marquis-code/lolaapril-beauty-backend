// dto/create-theme.dto.ts
import { IsObject, IsBoolean, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class ColorScheme {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  text: string;
  error: string;
  success: string;
}

class Typography {
  fontFamily: string;
  headingFont: string;
  bodyFont: string;
}

class Logo {
  url: string;
  width: number;
  height: number;
  alt: string;
}

export class CreateThemeDto {
  @IsObject()
  @ValidateNested()
  @Type(() => ColorScheme)
  colors: ColorScheme;

  @IsObject()
  @ValidateNested()
  @Type(() => Typography)
  typography: Typography;

  @IsObject()
  @ValidateNested()
  @Type(() => Logo)
  logo: Logo;

  @IsObject()
  favicon: { url: string };

  @IsObject()
  customCss: {
    enabled: boolean;
    cssCode: string;
  };
}