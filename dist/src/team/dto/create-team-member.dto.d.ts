export declare class WorkingHoursDto {
    day: string;
    startTime: string;
    endTime: string;
    isWorking: boolean;
}
export declare class SkillsDto {
    services?: string[];
    specializations?: string[];
    experienceLevel?: string;
}
export declare class CommissionDto {
    serviceId: string;
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
    phone: {
        countryCode: string;
        number: string;
    };
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
