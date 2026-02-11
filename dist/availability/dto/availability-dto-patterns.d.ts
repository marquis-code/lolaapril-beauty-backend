export declare class CreateStaffAvailabilityDto {
    businessId: string;
    staffId: string;
    date: string;
    availableSlots: Array<{
        startTime: string;
        endTime: string;
        isBreak: boolean;
    }>;
    createdBy: string;
}
export declare class GetAvailableSlotsPublicDto {
    businessId: string;
    date: string;
    serviceIds: string[];
    staffId?: string;
    bufferTime?: number;
}
declare const CreateMyAvailabilityDto_base: import("@nestjs/common").Type<Omit<CreateStaffAvailabilityDto, "businessId" | "createdBy" | "staffId">>;
export declare class CreateMyAvailabilityDto extends CreateMyAvailabilityDto_base {
}
export declare class CreateMyAvailabilityDtoExplicit {
    date: string;
    availableSlots: Array<{
        startTime: string;
        endTime: string;
        isBreak: boolean;
    }>;
}
declare const CreateStaffAvailabilityAdminDto_base: import("@nestjs/common").Type<Omit<CreateStaffAvailabilityDto, "businessId" | "createdBy">>;
export declare class CreateStaffAvailabilityAdminDto extends CreateStaffAvailabilityAdminDto_base {
}
export type WithBusinessContext<T> = Omit<T, 'businessId' | 'createdBy'> & {};
export type CompleteDto<T extends Record<string, any>> = T & {
    businessId: string;
    createdBy: string;
};
export declare class GetAvailabilitySlotsQueryDto {
    businessId?: string;
    date: string;
    serviceIds: string[];
}
export type RemoveJwtFields<T> = Omit<T, 'businessId' | 'createdBy' | 'updatedBy'>;
export type AddJwtFields<T> = T & {
    businessId: string;
    createdBy: string;
    updatedBy?: string;
};
declare const _default: {
    CreateStaffAvailabilityDto: typeof CreateStaffAvailabilityDto;
    GetAvailableSlotsPublicDto: typeof GetAvailableSlotsPublicDto;
    CreateMyAvailabilityDto: typeof CreateMyAvailabilityDto;
    CreateStaffAvailabilityAdminDto: typeof CreateStaffAvailabilityAdminDto;
    GetAvailabilitySlotsQueryDto: typeof GetAvailabilitySlotsQueryDto;
};
export default _default;
