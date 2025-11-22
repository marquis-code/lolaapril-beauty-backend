export declare class VariantPricingDto {
    priceType: string;
    price: {
        currency: string;
        amount: number;
    };
    duration: {
        value: number;
        unit: string;
    };
}
export declare class VariantSettingsDto {
    sku?: string;
}
export declare class CreateServiceVariantDto {
    variantName: string;
    variantDescription: string;
    pricing: VariantPricingDto;
    settings?: VariantSettingsDto;
}
