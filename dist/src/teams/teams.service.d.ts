import { Model } from "mongoose";
import { TeamMember, TeamMemberDocument } from "./schemas/team-member.schema";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
export declare class TeamsService {
    private teamMemberModel;
    constructor(teamMemberModel: Model<TeamMemberDocument>);
    create(createTeamMemberDto: CreateTeamMemberDto): Promise<TeamMember>;
    findAll(): Promise<TeamMember[]>;
    findOne(id: string): Promise<TeamMember>;
    update(id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<TeamMember>;
    softDelete(id: string, deletedBy: string): Promise<void>;
    hardDelete(id: string): Promise<void>;
    restore(id: string): Promise<TeamMember>;
}
