import { StaffSkillDto, StaffCommissionDto } from "./create-staff.dto";
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
