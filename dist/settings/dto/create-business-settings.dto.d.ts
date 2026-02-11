export declare class BusinessPhoneDto {
    countryCode: string;
    number: string;
}
export declare class BusinessAddressDto {
    street: string;
    city: string;
    region: string;
    postcode: string;
    country: string;
}
export declare class BusinessHoursDto {
    day: string;
    startTime: string;
    endTime: string;
    isOpen: boolean;
}
export declare class AppointmentStatusDto {
    statusName: string;
    statusIcon: string;
    statusColor: string;
    characterLimit?: number;
    isActive?: boolean;
}
export declare class CancellationReasonDto {
    name: string;
    reasonType: string;
    isActive?: boolean;
}
export declare class ResourceDto {
    name: string;
    description: string;
    isActive?: boolean;
}
export declare class BlockedTimeTypeDto {
    type: string;
    typeIcon: string;
    duration: string;
    compensation: string;
    isActive?: boolean;
}
export declare class PaymentMethodDto {
    name: string;
    paymentType: string;
    enabled: boolean;
}
export declare class ServiceChargeBasicInfoDto {
    name: string;
    description: string;
}
export declare class ServiceChargeSettingsDto {
    applyServiceChargeOn: string;
    automaticallyApplyDuringCheckout: boolean;
}
export declare class AmountDto {
    currency: string;
    value: number;
}
export declare class RateTypeDto {
    type: string;
    amount?: AmountDto;
    percentage?: number;
    flatRate?: AmountDto;
}
export declare class TaxRateDto {
    tax: string;
    rate: number;
}
export declare class ServiceChargeDto {
    basicInfo: ServiceChargeBasicInfoDto;
    settings: ServiceChargeSettingsDto;
    rateType: RateTypeDto;
    taxRate: TaxRateDto;
    isActive?: boolean;
}
export declare class TaxDto {
    taxName: string;
    taxRate: number;
    isActive?: boolean;
}
export declare class ClosedPeriodDto {
    startDate: string;
    endDate: string;
    description: string;
    businessClosed: boolean;
    onlineBookingBlocked: boolean;
}
export declare class CreateBusinessSettingsDto {
    businessName: string;
    businessEmail: string;
    businessPhone: BusinessPhoneDto;
    businessAddress: BusinessAddressDto;
    businessHours: BusinessHoursDto[];
    appointmentStatuses?: AppointmentStatusDto[];
    cancellationReasons?: CancellationReasonDto[];
    resources?: ResourceDto[];
    blockedTimeTypes?: BlockedTimeTypeDto[];
    paymentMethods?: PaymentMethodDto[];
    serviceCharges?: ServiceChargeDto[];
    taxes?: TaxDto[];
    closedPeriods?: ClosedPeriodDto[];
    defaultCurrency?: string;
    timezone?: string;
    defaultAppointmentDuration?: number;
    bookingWindowHours?: number;
    allowOnlineBooking?: boolean;
    requireClientConfirmation?: boolean;
}
