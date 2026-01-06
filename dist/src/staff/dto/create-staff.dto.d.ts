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
    userId: string;
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
}
