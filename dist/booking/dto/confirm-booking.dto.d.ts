export declare class StaffServiceAssignmentDto {
    staffId: string;
    serviceId: string;
    staffName?: string;
}
export declare class ConfirmBookingDto {
    staffId?: string;
    staffAssignments?: StaffServiceAssignmentDto[];
    notes?: string;
}
export interface StaffAssignmentResult {
    staffId: string;
    serviceId: string;
    staffName?: string;
    assignedAt: Date;
    status: 'assigned' | 'pending' | 'confirmed';
}
