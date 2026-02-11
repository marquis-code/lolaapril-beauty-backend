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
    getStaffByBusiness(businessId: string, status: string): Promise<{
        success: boolean;
        data: any[];
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
    getAvailableStaff(businessId: string, date: string, startTime: string, endTime: string, serviceId: string): Promise<{
        success: boolean;
        data: any[];
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
    createSchedule(createScheduleDto: CreateStaffScheduleDto, req: any, businessId: string): Promise<{
        success: boolean;
        data: any;
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
    assignStaff(assignStaffDto: AssignStaffDto, req: any, businessId: string): Promise<{
        success: boolean;
        data: {
            staffId: string;
            serviceId: string;
            staffName?: string;
            email?: string;
            phone?: string;
            status: string;
            assignedAt: Date;
        };
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
        data: {
            staffId: string;
            serviceId: string;
            staffName?: string;
            email?: string;
            phone?: string;
            status: string;
            assignedAt: Date;
        };
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
    checkIn(checkInDto: CheckInStaffDto, req: any, businessId: string): Promise<{
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
    checkOut(staffId: string, req: any, businessId: string): Promise<{
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
    getSchedule(staffId: string, date: string): Promise<{
        success: boolean;
        data: any;
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
        data: any[];
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
    getWorkingHours(staffId: string, startDate: string, endDate: string): Promise<{
        success: boolean;
        data: any[];
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
        data: any;
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
        data: any;
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
        data: any;
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
        data: any;
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
    createStaff(createStaffDto: CreateStaffDto, businessId: string): Promise<{
        success: boolean;
        data: any;
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
