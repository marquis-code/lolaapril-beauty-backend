export declare class VoucherRestrictionsDto {
    applicableServices?: string[];
    applicableCategories?: string[];
    minimumSpend?: number;
    maximumDiscount?: number;
    excludedServices?: string[];
    firstTimeClientsOnly?: boolean;
    applicableDays?: string[];
}
export declare class CreateVoucherDto {
    voucherCode: string;
    voucherName: string;
    description: string;
    discountType: string;
    discountValue: number;
    validFrom: Date;
    validUntil: Date;
    usageLimit?: number;
    usagePerClient?: number;
    restrictions?: VoucherRestrictionsDto;
    status?: string;
}
