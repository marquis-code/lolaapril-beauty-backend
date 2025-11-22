declare class BusinessAddressDto {
    street: string;
    city: string;
    state: string;
    country: string;
    postalCode?: string;
    latitude?: number;
    longitude?: number;
}
declare class SocialMediaDto {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    tiktok?: string;
}
declare class BusinessContactDto {
    primaryPhone: string;
    secondaryPhone?: string;
    email: string;
    website?: string;
    socialMedia?: SocialMediaDto;
}
declare class NotificationSettingsDto {
    booking_confirmation?: boolean;
    payment_reminders?: boolean;
    appointment_reminders?: boolean;
    marketing?: boolean;
}
declare class BusinessSettingsDto {
    timezone?: string;
    currency?: string;
    language?: string;
    defaultAppointmentDuration?: number;
    bufferTimeBetweenAppointments?: number;
    cancellationPolicyHours?: number;
    advanceBookingDays?: number;
    allowOnlineBooking?: boolean;
    requireEmailVerification?: boolean;
    requirePhoneVerification?: boolean;
    taxRate?: number;
    serviceCharge?: number;
    notificationSettings?: NotificationSettingsDto;
}
declare class BankAccountDto {
    accountName?: string;
    accountNumber?: string;
    bankName?: string;
    bankCode?: string;
}
declare class BusinessDocumentsDto {
    businessRegistration?: string;
    taxIdentification?: string;
    bankAccount?: BankAccountDto;
}
export declare class CreateBusinessDto {
    businessName: string;
    subdomain: string;
    businessDescription?: string;
    businessType: string;
    logo?: string;
    images?: string[];
    address: BusinessAddressDto;
    contact: BusinessContactDto;
    settings?: BusinessSettingsDto;
    ownerId: string;
    adminIds?: string[];
    status?: string;
    trialEndsAt?: string;
    activeSubscription?: string;
    businessDocuments?: BusinessDocumentsDto;
}
export declare class UpdateBusinessDto {
    businessName?: string;
    businessDescription?: string;
    businessType?: string;
    logo?: string;
    images?: string[];
    address?: BusinessAddressDto;
    contact?: BusinessContactDto;
    settings?: BusinessSettingsDto;
    adminIds?: string[];
    status?: string;
    trialEndsAt?: string;
    activeSubscription?: string;
    businessDocuments?: BusinessDocumentsDto;
}
export {};
