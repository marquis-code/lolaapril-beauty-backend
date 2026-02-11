export declare class CustomRulesDto {
    noShowFee?: number;
    cancellationFee?: number;
    minBookingAmount?: number;
}
export declare class CreateFeeStructureDto {
    pricingTierId?: string;
    platformFeePercentage: number;
    platformFeeFixed?: number;
    effectiveFrom?: string;
    effectiveTo?: string;
    isGrandfathered?: boolean;
    customRules?: CustomRulesDto;
}
