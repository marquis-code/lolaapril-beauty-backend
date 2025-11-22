export declare class BusinessInfoDto {
    businessId: string;
    businessName: string;
    rating?: number;
    reviewCount?: number;
    address: string;
}
export declare class DurationDto {
    hours: number;
    minutes: number;
}
export declare class PriceDto {
    currency: string;
    amount: number;
}
export declare class SelectedOptionDto {
    optionId: string;
    optionName: string;
    duration: DurationDto;
    description: string;
    price: PriceDto;
}
export declare class AdditionalServiceDto {
    serviceId: string;
    serviceName: string;
    duration: DurationDto;
    description: string;
    price: PriceDto;
}
export declare class SelectedServiceDto {
    serviceId: string;
    serviceName: string;
    serviceType: string;
    selectedOption: SelectedOptionDto;
    additionalServices?: AdditionalServiceDto[];
}
export declare class AppointmentDetailsDto {
    date: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
    duration: string;
}
export declare class ServiceDetailsDto {
    serviceName: string;
    serviceDescription: string;
    price: PriceDto;
}
export declare class PaymentStatusDto {
    payNow: PriceDto;
    payAtVenue: PriceDto;
}
export declare class TaxDto {
    currency: string;
    amount: number;
    rate: number;
}
export declare class PaymentDetailsDto {
    paymentMethod: string;
    subtotal: PriceDto;
    tax: TaxDto;
    total: PriceDto;
    paymentStatus: PaymentStatusDto;
}
export declare class PaymentInstructionsDto {
    paymentUrl?: string;
    confirmationPolicy: string;
}
export declare class CreateAppointmentDto {
    clientId: string;
    businessInfo: BusinessInfoDto;
    selectedServices: SelectedServiceDto[];
    totalDuration: DurationDto;
    selectedDate: string;
    selectedTime: string;
    appointmentDetails: AppointmentDetailsDto;
    serviceDetails: ServiceDetailsDto;
    paymentDetails: PaymentDetailsDto;
    paymentInstructions?: PaymentInstructionsDto;
    customerNotes?: string;
    status?: string;
    assignedStaff?: string;
}
