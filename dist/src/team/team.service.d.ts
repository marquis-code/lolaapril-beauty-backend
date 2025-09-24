import { Model } from "mongoose";
import { TeamMember, TeamMemberDocument } from "./schemas/team-member.schema";
import { ServiceDocument } from "../service/schemas/service.schema";
import { CreateTeamMemberDto } from "./dto/create-team-member.dto";
import { UpdateTeamMemberDto } from "./dto/update-team-member.dto";
import { TeamMemberQueryDto } from "./dto/team-member-query.dto";
import { ApiResponse } from "../common/interfaces/common.interface";
export declare class TeamService {
    private teamMemberModel;
    private serviceModel;
    constructor(teamMemberModel: Model<TeamMemberDocument>, serviceModel: Model<ServiceDocument>);
    private validateObjectId;
    private validateServiceReferences;
    create(createTeamMemberDto: CreateTeamMemberDto): Promise<ApiResponse<TeamMember>>;
    findAll(query: TeamMemberQueryDto): Promise<ApiResponse<TeamMember[]>>;
    findOne(id: string): Promise<ApiResponse<TeamMember>>;
    update(id: string, updateTeamMemberDto: UpdateTeamMemberDto): Promise<ApiResponse<TeamMember>>;
    remove(id: string): Promise<ApiResponse<null>>;
    findByRole(role: string): Promise<ApiResponse<TeamMember[]>>;
    findByDepartment(department: string): Promise<ApiResponse<TeamMember[]>>;
    updateStatus(id: string, status: string): Promise<ApiResponse<TeamMember>>;
    addCommission(teamMemberId: string, serviceId: string, commissionData: {
        commissionType: string;
        commissionValue: number;
    }): Promise<ApiResponse<TeamMember>>;
    getTeamStats(): Promise<ApiResponse<any>>;
}
