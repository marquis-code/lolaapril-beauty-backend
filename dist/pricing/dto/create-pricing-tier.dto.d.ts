export declare class CreatePricingTierDto {
    tierName: string;
    tierLevel: number;
    monthlyPrice: number;
    yearlyPrice: number;
    features: {
        maxStaff: number;
        maxBookingsPerMonth: number;
        customBranding: boolean;
        analyticsAccess: boolean;
        prioritySupport: boolean;
        multiLocation: boolean;
        apiAccess: boolean;
    };
    commissionRate: number;
    description: string;
}
