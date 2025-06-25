import { FormFieldType } from "../../common/enums";
declare class FormFieldDto {
    id: string;
    label: string;
    type: FormFieldType;
    required?: boolean;
    options?: string[];
    placeholder?: string;
    description?: string;
}
declare class HighlightDto {
    title: string;
    description: string;
}
export declare class CreateProgramDto {
    title: string;
    category: string;
    description: string;
    duration?: string;
    focusAreas?: string[];
    outcomes?: string[];
    keyResponsibilities?: string[];
    image?: string;
    highlights?: HighlightDto[];
    formFields: FormFieldDto[];
    formTitle?: string;
    formInstructions?: string;
}
export {};
