import { TeamService } from "./team.service";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { TeamMemberQueryDto } from "./dto/team-member-query.dto";
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    create(businessId: string, createTeamMemberDto: CreateTeamMemberDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember>>;
    findAll(businessId: string, query: TeamMemberQueryDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember[]>>;
    getStats(businessId: string): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    findByRole(businessId: string, role: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember[]>>;
    findByDepartment(businessId: string, department: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember[]>>;
    findOne(businessId: string, id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember>>;
    update(businessId: string, id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember>>;
    updateStatus(businessId: string, id: string, status: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember>>;
    remove(businessId: string, id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<null>>;
}
