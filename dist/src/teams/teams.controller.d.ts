import { TeamsService } from "./teams.service";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
export declare class TeamsController {
    private readonly teamsService;
    constructor(teamsService: TeamsService);
    create(createTeamMemberDto: CreateTeamMemberDto): Promise<import("./schemas/team-member.schema").TeamMember>;
    findAll(): Promise<import("./schemas/team-member.schema").TeamMember[]>;
    findOne(id: string): Promise<import("./schemas/team-member.schema").TeamMember>;
    update(id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<import("./schemas/team-member.schema").TeamMember>;
    softDelete(id: string, user: any): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<import("./schemas/team-member.schema").TeamMember>;
}
