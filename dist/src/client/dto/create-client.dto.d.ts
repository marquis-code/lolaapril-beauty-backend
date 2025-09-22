import { PhoneDto, AddressDto } from "../../common/dto/common.dto";
export declare class EmergencyContactDto {
    fullName: string;
    relationship: string;
    email?: string;
    phone: PhoneDto;
}
export declare class ClientProfileDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: PhoneDto;
    birthday?: {
        dayAndMonth: string;
        year: string;
    };
    gender?: string;
    pronouns?: string;
    additionalEmail?: string;
    additionalPhone?: PhoneDto;
}
export declare class AdditionalInfoDto {
    clientSource?: string;
    referredBy?: {
        clientId: string;
        clientName: string;
    };
    preferredLanguage?: string;
    occupation?: string;
    country?: string;
}
export declare class ClientSettingsDto {
    appointmentNotifications?: {
        emailNotifications: boolean;
    };
    marketingNotifications?: {
        clientAcceptsEmailMarketing: boolean;
    };
}
export declare class CreateClientDto {
    profile: ClientProfileDto;
    additionalInfo?: AdditionalInfoDto;
    emergencyContacts?: {
        primary?: EmergencyContactDto;
        secondary?: EmergencyContactDto;
    };
    address?: AddressDto;
    settings?: ClientSettingsDto;
}
