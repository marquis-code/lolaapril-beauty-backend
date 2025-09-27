export declare class TimeSlotDto {
    startTime: string;
    endTime: string;
    isBreak?: boolean;
    breakType?: string;
}
export declare class DailyScheduleDto {
    dayOfWeek: number;
    isWorkingDay?: boolean;
    workingHours: TimeSlotDto[];
    breaks?: TimeSlotDto[];
    maxHoursPerDay?: number;
}
export declare class CreateStaffScheduleDto {
    staffId: string;
    businessId: string;
    effectiveDate: Date;
    endDate?: Date;
    weeklySchedule: DailyScheduleDto[];
    scheduleType?: string;
    reason?: string;
    createdBy: string;
}
