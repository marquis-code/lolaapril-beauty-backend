declare class FormResponseDto {
    fieldId: string;
    fieldLabel: string;
    value: string;
}
export declare class SubmitApplicationDto {
    applicantEmail: string;
    responses: FormResponseDto[];
}
export {};
