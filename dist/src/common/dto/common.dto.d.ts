export declare class CurrencyDto {
    currency: string;
    amount: number;
}
export declare class DurationDto {
    value: number;
    unit: "min" | "h" | "day";
}
export declare class PhoneDto {
    countryCode: string;
    number: string;
}
export declare class AddressDto {
    addressName?: string;
    addressType?: string;
    street: string;
    aptSuite?: string;
    district?: string;
    city: string;
    region: string;
    postcode: string;
    country: string;
}
