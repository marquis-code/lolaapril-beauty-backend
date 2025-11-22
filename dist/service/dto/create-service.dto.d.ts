export declare class TimeValueDto {
    value: number;
    unit: "min" | "h";
}
export declare class BasicDetailsDto {
    serviceName: string;
    serviceType: string;
    category: string;
    description: string;
}
export declare class TeamMemberDto {
    id: string;
    name?: string;
    role?: string;
    selected: boolean;
}
export declare class TeamMembersDto {
    allTeamMembers: boolean;
    selectedMembers: TeamMemberDto[];
}
export declare class ResourcesDto {
    isRequired: boolean;
    resourceList: string[];
}
export declare class PriceDto {
    currency: string;
    amount: number;
    minimumAmount?: number;
}
export declare class ServiceDurationDto {
    servicingTime: TimeValueDto;
    processingTime: TimeValueDto;
    totalDuration: string;
}
export declare class ExtraTimeOptionsDto {
    processingTime?: string;
    blockedTime?: string;
    extraServicingTime?: string;
}
export declare class PricingAndDurationDto {
    priceType: string;
    price: PriceDto;
    duration: ServiceDurationDto;
    extraTimeOptions?: ExtraTimeOptionsDto;
}
export declare class OnlineBookingDto {
    enabled: boolean;
    availableFor: string;
}
export declare class ServiceSettingsDto {
    onlineBooking: OnlineBookingDto;
    forms?: string[];
    commissions?: string[];
    generalSettings?: Record<string, any>;
}
export declare class CreateServiceDto {
    basicDetails: BasicDetailsDto;
    teamMembers: TeamMembersDto;
    resources?: ResourcesDto;
    pricingAndDuration: PricingAndDurationDto;
    serviceAddOns?: string[];
    settings?: ServiceSettingsDto;
}
