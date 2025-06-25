declare class FormResponseDto {
    fieldId: string;
    fieldLabel: string;
    value: string;
}
export declare class SubmitFormDto {
    submitterEmail?: string;
    responses: FormResponseDto[];
}
export {};
