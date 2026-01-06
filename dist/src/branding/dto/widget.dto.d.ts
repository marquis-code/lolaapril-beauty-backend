export declare enum WidgetDisplayType {
    MODAL = "modal",
    INLINE = "inline",
    POPUP = "popup",
    SIDEBAR = "sidebar"
}
export declare enum WidgetTheme {
    LIGHT = "light",
    DARK = "dark",
    CUSTOM = "custom"
}
declare class WidgetConfiguration {
    displayType: WidgetDisplayType;
    buttonText: string;
    buttonColor: string;
    showBranding: boolean;
    allowedOrigins?: string[];
}
declare class WidgetStyling {
    theme: WidgetTheme;
    primaryColor: string;
    borderRadius: string;
    fontSize: string;
}
export declare class CreateWidgetDto {
    name?: string;
    configuration: WidgetConfiguration;
    styling: WidgetStyling;
}
declare const UpdateWidgetDto_base: import("@nestjs/common").Type<Partial<CreateWidgetDto>>;
export declare class UpdateWidgetDto extends UpdateWidgetDto_base {
    isActive?: boolean;
}
export {};
