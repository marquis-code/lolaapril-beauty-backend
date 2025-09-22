import type { Model } from "mongoose";
import type { TeamMember, TeamMemberDocument } from "./schemas/team-member.schema";
import type { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import type { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import type { TeamMemberQueryDto } from "./dto/team-member-query.dto";
export declare class TeamService {
    private teamMemberModel;
    constructor(teamMemberModel: Model<TeamMemberDocument>);
    create(createTeamMemberDto: CreateTeamMemberDto): Promise<TeamMember>;
    findAll(query: TeamMemberQueryDto): Promise<{
        teamMembers: (import("mongoose").Document<unknown, {}, TeamMemberDocument, {}> & TeamMember & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
            _id: unknown;
        }> & {
            __v: number;
        })[];
        pagination: {
            page: number;
            limit: number;
            total: number;
            pages: number;
        };
    }>;
    findOne(id: string): Promise<TeamMember>;
    update(id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<TeamMember>;
    remove(id: string): Promise<void>;
    findByRole(role: string): Promise<TeamMember[]>;
    findByDepartment(department: string): Promise<TeamMember[]>;
    updateStatus(id: string, status: string): Promise<TeamMember>;
    getTeamStats(): Promise<{
        overview: any;
        byRole: any[];
        byDepartment: any[];
    }>;
}
