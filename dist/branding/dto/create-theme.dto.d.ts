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
export declare class CreateThemeDto {
    colors: ColorScheme;
    typography: Typography;
    logo: Logo;
    favicon: {
        url: string;
    };
    customCss: {
        enabled: boolean;
        cssCode: string;
    };
}
export {};
