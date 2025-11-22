import { TeamService } from "./team.service";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { TeamMemberQueryDto } from "./dto/team-member-query.dto";
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    create(createTeamMemberDto: CreateTeamMemberDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember>>;
    findAll(query: TeamMemberQueryDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember[]>>;
    getStats(): Promise<import("../common/interfaces/common.interface").ApiResponse<any>>;
    findByRole(role: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember[]>>;
    findByDepartment(department: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember[]>>;
    findOne(id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember>>;
    update(id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember>>;
    updateStatus(id: string, status: string): Promise<import("../common/interfaces/common.interface").ApiResponse<import("./schemas/team-member.schema").TeamMember>>;
    remove(id: string): Promise<import("../common/interfaces/common.interface").ApiResponse<null>>;
}
