import { FormFieldType } from "../../common/enums";
declare class FormFieldDto {
    id: string;
    label: string;
    type: FormFieldType;
    required?: boolean;
    options?: string[];
    placeholder?: string;
    description?: string;
    validation?: string;
}
export declare class CreateFormDto {
    title: string;
    description?: string;
    instructions?: string;
    fields: FormFieldDto[];
    successMessage?: string;
    redirectUrl?: string;
}
export {};
