import { TeamService } from "./team.service";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { TeamMemberQueryDto } from "./dto/team-member-query.dto";
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    create(createTeamMemberDto: CreateTeamMemberDto): Promise<import("./schemas/team-member.schema").TeamMember>;
    findAll(query: TeamMemberQueryDto): Promise<{
        teamMembers: (import("mongoose").Document<unknown, {}, import("./schemas/team-member.schema").TeamMemberDocument, {}> & import("./schemas/team-member.schema").TeamMember & import("mongoose").Document<unknown, any, any, Record<string, any>> & Required<{
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
    getStats(): Promise<{
        overview: any;
        byRole: any[];
        byDepartment: any[];
    }>;
    findByRole(role: string): Promise<import("./schemas/team-member.schema").TeamMember[]>;
    findByDepartment(department: string): Promise<import("./schemas/team-member.schema").TeamMember[]>;
    findOne(id: string): Promise<import("./schemas/team-member.schema").TeamMember>;
    update(id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<import("./schemas/team-member.schema").TeamMember>;
    updateStatus(id: string, status: string): Promise<import("./schemas/team-member.schema").TeamMember>;
    remove(id: string): Promise<void>;
}
