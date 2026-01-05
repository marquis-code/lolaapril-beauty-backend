declare class BusinessAddressDto {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
}
declare class BusinessContactDto {
    primaryPhone: string;
    email: string;
    website?: string;
}
export declare class AddBusinessDto {
    businessName: string;
    subdomain: string;
    businessType: string;
    businessDescription?: string;
    address: BusinessAddressDto;
    contact: BusinessContactDto;
}
export {};
