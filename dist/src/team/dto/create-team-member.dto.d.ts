import { Types } from "mongoose";
export declare class PhoneDto {
    countryCode: string;
    number: string;
}
export declare class WorkingHoursDto {
    day: string;
    startTime: string;
    endTime: string;
    isWorking: boolean;
}
export declare class SkillsDto {
    services?: string[] | Types.ObjectId[];
    specializations?: string[];
    experienceLevel?: string;
}
export declare class CommissionDto {
    serviceId: string | Types.ObjectId;
    serviceName: string;
    commissionType: string;
    commissionValue: number;
}
export declare class EmergencyContactDto {
    name: string;
    relationship: string;
    phone: string;
}
export declare class CreateTeamMemberDto {
    firstName: string;
    lastName: string;
    email: string;
    phone: PhoneDto;
    role: string;
    employmentType: string;
    hireDate?: Date;
    salary?: number;
    workingHours?: WorkingHoursDto[];
    skills?: SkillsDto;
    commissions?: CommissionDto[];
    profileImage?: string;
    bio?: string;
    isActive?: boolean;
    canBookOnline?: boolean;
    emergencyContact?: EmergencyContactDto;
}
