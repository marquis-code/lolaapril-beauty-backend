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
}
export declare class CancellationReasonDto {
    name: string;
    reasonType: string;
}
export declare class ResourceDto {
    name: string;
    description: string;
}
export declare class BlockedTimeTypeDto {
    type: string;
    typeIcon: string;
    duration: string;
    compensation: string;
}
export declare class PaymentMethodDto {
    name: string;
    paymentType: string;
    enabled: boolean;
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
    businessPhone: {
        countryCode: string;
        number: string;
    };
    businessAddress: {
        street: string;
        city: string;
        region: string;
        postcode: string;
        country: string;
    };
    businessHours: BusinessHoursDto[];
    appointmentStatuses?: AppointmentStatusDto[];
    cancellationReasons?: CancellationReasonDto[];
    resources?: ResourceDto[];
    blockedTimeTypes?: BlockedTimeTypeDto[];
    paymentMethods?: PaymentMethodDto[];
    closedPeriods?: ClosedPeriodDto[];
    defaultCurrency?: string;
    timezone?: string;
    defaultAppointmentDuration?: number;
    bookingWindowHours?: number;
    allowOnlineBooking?: boolean;
    requireClientConfirmation?: boolean;
}
