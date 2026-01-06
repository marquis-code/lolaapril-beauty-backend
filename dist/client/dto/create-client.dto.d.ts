import { PhoneDto, AddressDto } from "../../common/dto/common.dto";
export declare class BirthdayDto {
    dayAndMonth: string;
    year: string;
}
export declare class ReferredByDto {
    clientId: string;
    clientName: string;
}
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
    birthday?: BirthdayDto;
    gender?: string;
    pronouns?: string;
    additionalEmail?: string;
    additionalPhone?: PhoneDto;
}
export declare class AdditionalInfoDto {
    clientSource?: string;
    referredBy?: ReferredByDto;
    preferredLanguage?: string;
    occupation?: string;
    country?: string;
}
export declare class AppointmentNotificationsDto {
    emailNotifications?: boolean;
}
export declare class MarketingNotificationsDto {
    clientAcceptsEmailMarketing?: boolean;
}
export declare class ClientSettingsDto {
    appointmentNotifications?: AppointmentNotificationsDto;
    marketingNotifications?: MarketingNotificationsDto;
    grokCodeFast1Enabled?: boolean;
}
export declare class EmergencyContactsDto {
    primary?: EmergencyContactDto;
    secondary?: EmergencyContactDto;
}
export declare class CreateClientDto {
    profile: ClientProfileDto;
    additionalInfo?: AdditionalInfoDto;
    emergencyContacts?: EmergencyContactsDto;
    address?: AddressDto;
    settings?: ClientSettingsDto;
}
