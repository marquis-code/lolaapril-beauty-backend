import { TeamRole, TeamStatus } from "../schemas/team-member.schema";
export declare class TeamMemberQueryDto {
    page?: number;
    limit?: number;
    search?: string;
    role?: TeamRole;
    status?: TeamStatus;
    department?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
}
