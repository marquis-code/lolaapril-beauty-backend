import { StaffService } from '../staff/staff.service';
import { CreateStaffDto } from '../staff/dto/create-staff.dto';
import { CreateStaffScheduleDto } from '../staff/dto/create-staff-schedule.dto';
import { AssignStaffDto } from '../staff/dto/assign-staff.dto';
import { AutoAssignStaffDto } from '../staff/dto/auto-assign-staff.dto';
import { CheckInStaffDto } from '../staff/dto/check-in-staff.dto';
import { CompleteAssignmentDto } from '../staff/dto/complete-assignment.dto';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
    createStaff(createStaffDto: CreateStaffDto, req: any): Promise<{
        success: boolean;
        data: import("./schemas/staff.schema").StaffDocument;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    getStaffByBusiness(status: string, req: any): Promise<{
        success: boolean;
        data: import("./schemas/staff.schema").StaffDocument[];
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    getAvailableStaff(date: string, startTime: string, endTime: string, serviceId: string, req: any): Promise<{
        success: boolean;
        data: import("./schemas/staff.schema").StaffDocument[];
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    createSchedule(createScheduleDto: CreateStaffScheduleDto, req: any): Promise<{
        success: boolean;
        data: import("./schemas/staff-schedule.schema").StaffScheduleDocument;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    getSchedule(staffId: string, date: string): Promise<{
        success: boolean;
        data: import("./schemas/staff-schedule.schema").StaffScheduleDocument;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    assignStaff(assignStaffDto: AssignStaffDto, req: any): Promise<{
        success: boolean;
        data: import("./schemas/staff-assignment.schema").StaffAssignmentDocument;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    autoAssignStaff(autoAssignDto: AutoAssignStaffDto): Promise<{
        success: boolean;
        data: import("./schemas/staff-assignment.schema").StaffAssignmentDocument;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    getAssignments(staffId: string, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: import("./schemas/staff-assignment.schema").StaffAssignmentDocument[];
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    completeAssignment(assignmentId: string, completionData: CompleteAssignmentDto): Promise<{
        success: boolean;
        data: import("./schemas/staff-assignment.schema").StaffAssignmentDocument;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    checkIn(checkInDto: CheckInStaffDto, req: any): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        message?: undefined;
    }>;
    checkOut(staffId: string, req: any): Promise<{
        success: boolean;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        message?: undefined;
    }>;
    getWorkingHours(staffId: string, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: import("./schemas/working-hours.schema").WorkingHoursDocument[];
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    getStaffById(staffId: string): Promise<{
        success: boolean;
        data: import("./schemas/staff.schema").StaffDocument;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    updateStaffSkills(staffId: string, skills: any[]): Promise<{
        success: boolean;
        data: import("./schemas/staff.schema").StaffDocument;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
    updateStaffStatus(staffId: string, status: string, reason?: string): Promise<{
        success: boolean;
        data: import("./schemas/staff.schema").StaffDocument;
        message: string;
        error?: undefined;
        code?: undefined;
    } | {
        success: boolean;
        error: any;
        code: string;
        data?: undefined;
        message?: undefined;
    }>;
}
