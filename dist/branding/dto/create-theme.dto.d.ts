declare class ColorScheme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    error: string;
    success: string;
    _id?: any;
}
declare class Typography {
    fontFamily: string;
    headingFont: string;
    bodyFont: string;
    _id?: any;
}
declare class Logo {
    url: string;
    width: number;
    height: number;
    alt: string;
    _id?: any;
}
declare class Favicon {
    url: string;
    _id?: any;
}
declare class CustomCss {
    enabled: boolean;
    cssCode: string;
    _id?: any;
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
