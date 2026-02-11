declare class BusinessOwnerDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
}
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
export declare class BusinessRegisterDto {
    owner: BusinessOwnerDto;
    businessName: string;
    subdomain: string;
    businessType: string;
    businessDescription?: string;
    address: BusinessAddressDto;
    contact: BusinessContactDto;
}
export declare class BusinessLoginDto {
    email: string;
    password: string;
    subdomain?: string;
}
export declare class GoogleAuthDto {
    idToken: string;
    subdomain?: string;
}
export {};
