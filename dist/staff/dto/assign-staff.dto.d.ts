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
    clientId: string;
    assignmentDate: Date;
    assignmentDetails: AssignmentDetailsDto;
    assignedBy: string;
    assignmentMethod?: string;
}
