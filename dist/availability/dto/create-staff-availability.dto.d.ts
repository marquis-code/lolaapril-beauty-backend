export declare class TimeSlotDto {
    startTime: string;
    endTime: string;
    isBreak?: boolean;
}
export declare class CreateStaffAvailabilityDto {
    staffId: string;
    businessId?: string;
    date: string;
    availableSlots: TimeSlotDto[];
    reason?: string;
    createdBy: string;
}
