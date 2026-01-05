export declare enum EmailTemplateType {
    BOOKING_CONFIRMATION = "booking_confirmation",
    BOOKING_REMINDER = "booking_reminder",
    BOOKING_CANCELLATION = "booking_cancellation",
    WELCOME = "welcome",
    PASSWORD_RESET = "password_reset",
    INVOICE = "invoice",
    RECEIPT = "receipt",
    CUSTOM = "custom"
}
export declare class CreateEmailTemplateDto {
    templateType: EmailTemplateType | string;
    subject: string;
    htmlContent: string;
    textContent?: string;
}
declare const UpdateEmailTemplateDto_base: import("@nestjs/common").Type<Partial<CreateEmailTemplateDto>>;
export declare class UpdateEmailTemplateDto extends UpdateEmailTemplateDto_base {
    isActive?: boolean;
}
export {};
