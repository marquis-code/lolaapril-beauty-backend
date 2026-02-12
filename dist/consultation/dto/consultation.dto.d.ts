declare class TimeSlotDto {
    startTime: string;
    endTime: string;
}
declare class DayScheduleDto {
    dayOfWeek: number;
    isOpen?: boolean;
    timeSlots: TimeSlotDto[];
}
export declare class CreateConsultationPackageDto {
    name: string;
    description?: string;
    price: number;
    duration: number;
}
export declare class UpdateConsultationPackageDto {
    name?: string;
    description?: string;
    price?: number;
    duration?: number;
    isActive?: boolean;
}
export declare class UpdateConsultationAvailabilityDto {
    weeklySchedule: DayScheduleDto[];
}
export declare class BookConsultationDto {
    packageId: string;
    startTime: string;
    notes?: string;
}
export declare class GetAvailableSlotsDto {
    date: string;
}
export {};
