export declare class BasicInfoDto {
    bundleName: string;
    category: string;
    description: string;
}
export declare class BundleServiceDto {
    serviceId: string;
    serviceName: string;
    duration: number;
    sequence: number;
}
export declare class BundlePricingDto {
    priceType: string;
    retailPrice: {
        currency: string;
        amount: number;
    };
}
export declare class BundleOnlineBookingDto {
    enabled: boolean;
    availableFor: string;
}
export declare class CreateServiceBundleDto {
    basicInfo: BasicInfoDto;
    services: BundleServiceDto[];
    scheduleType: string;
    pricing: BundlePricingDto;
    onlineBooking?: BundleOnlineBookingDto;
}
