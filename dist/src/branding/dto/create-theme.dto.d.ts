declare class ColorScheme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    error: string;
    success: string;
}
declare class Typography {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
}
declare class Logo {
    url: string;
    width: number;
    height: number;
    alt: string;
}
declare class Favicon {
    url: string;
}
declare class CustomCss {
    enabled: boolean;
    cssCode: string;
}
export declare class CreateThemeDto {
    colors: ColorScheme;
    typography: Typography;
    logo?: Logo;
    favicon?: Favicon;
    customCss: CustomCss;
}
declare const UpdateThemeDto_base: import("@nestjs/common").Type<Partial<CreateThemeDto>>;
export declare class UpdateThemeDto extends UpdateThemeDto_base {
}
export {};
