export declare class StaffSkillDto {
    serviceId: string;
    serviceName: string;
    skillLevel: string;
    experienceMonths?: number;
    isActive?: boolean;
}
export declare class StaffCommissionDto {
    serviceId?: string;
    commissionType: string;
    commissionValue: number;
    minimumAmount?: number;
    isActive?: boolean;
}
export declare class CreateStaffDto {
    businessId: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: string;
    employmentType?: string;
    hireDate: Date;
    skills?: StaffSkillDto[];
    commissionStructure?: StaffCommissionDto[];
    profileImage?: string;
    bio?: string;
    certifications?: string[];
    password?: string;
}
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
    isDefault24_7?: boolean;
}
export declare class AssignmentDetailsDto {
    startTime: string;
    endTime: string;
    assignmentType?: string;
    estimatedDuration?: number;
    specialInstructions?: string;
    roomNumber?: string;
    requiredEquipment?: string[];
    clientPreferences?: string;
    setupTimeMinutes?: number;
    cleanupTimeMinutes?: number;
    serviceId: string;
    serviceName: string;
}
export declare class AssignStaffDto {
    staffId: string;
    businessId: string;
    appointmentId: string;
    clientId?: string;
    assignmentDate: Date;
    assignmentDetails: AssignmentDetailsDto;
    assignedBy?: string;
    assignmentMethod?: string;
}
export declare class AutoAssignStaffDto {
    businessId: string;
    appointmentId: string;
    clientId: string;
    serviceId: string;
    assignmentDate: Date;
    startTime: string;
    endTime: string;
}
export declare class CheckInStaffDto {
    staffId: string;
    businessId: string;
    checkedInBy: string;
    notes?: string;
}
export declare class CompleteAssignmentDto {
    actualStartTime?: string;
    actualEndTime?: string;
    completionNotes?: string;
    rating?: number;
    clientFeedback?: string;
    staffFeedback?: string;
    qualityCheckNotes?: string;
    qualityCheckCompleted?: boolean;
    qualityCheckedBy?: string;
}
export declare class GetStaffAssignmentsDto {
    staffId: string;
    startDate: Date;
    endDate: Date;
    status?: string;
    serviceId?: string;
}
export declare class CheckAvailabilityDto {
    businessId: string;
    date: Date;
    startTime: string;
    endTime: string;
    serviceId?: string;
    excludeStaffIds?: string[];
}
export declare class UpdateStaffDto {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    role?: string;
    employmentType?: string;
    status?: string;
    profileImage?: string;
    bio?: string;
    certifications?: string[];
    skills?: StaffSkillDto[];
    commissionStructure?: StaffCommissionDto[];
}
